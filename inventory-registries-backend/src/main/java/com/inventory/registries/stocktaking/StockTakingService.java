package com.inventory.registries.stocktaking;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.inventory.registries.common.exception.ResourceNotFoundException;
import com.inventory.registries.notification.NotificationService;
import com.inventory.registries.notification.NotificationType;
import com.inventory.registries.product.Product;
import com.inventory.registries.product.ProductRepository;
import com.inventory.registries.security.User;
import com.inventory.registries.security.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class StockTakingService {

    private final StockTakingRepository repo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final NotificationService notificationService;

    public StockTakingService(
            StockTakingRepository repo,
            ProductRepository productRepo,
            UserRepository userRepo,
            NotificationService notificationService) {

        this.repo = repo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.notificationService = notificationService;
    }

    // ---------------- CREATE (DRAFT) ----------------
    public StockTaking create(Long productId, Integer physicalStock, Authentication auth) {

        Product product = productRepo.findByIdAndActiveTrue(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (repo.existsByProduct_IdAndStatusAndActiveTrue(
                productId, StockTaking.StockStatus.DRAFT)) {
            throw new IllegalStateException(
                "A draft stock-taking already exists for this product"
            );
        }

        int systemStock = product.getStock();
        int variance = physicalStock - systemStock;

        StockTaking st = new StockTaking();
        st.setProduct(product);
        st.setSystemStock(systemStock);
        st.setPhysicalStock(physicalStock);
        st.setVariance(variance);
        st.setStatus(StockTaking.StockStatus.DRAFT);
        st.setActive(true);

        // ✅ DO NOT set createdBy manually

        StockTaking saved = repo.save(st);

        // 🔔 Notify MANAGER & SUPER_ADMIN
        List<User> approvers =
                userRepo.findByRoleIn(List.of("MANAGER", "SUPER_ADMIN"));

        for (User user : approvers) {
            notificationService.send(
                user.getUsername(),
                "New Stock Audit Created",
                "Stock audit #" + saved.getId() + " requires approval.",
                NotificationType.ALERT,
                "STOCK_TAKING",
                saved.getId()
            );
        }

        return saved;
    }


    // ---------------- LIST ----------------
    public List<StockTaking> list() {
        return repo.findByActiveTrue();
    }

    // ---------------- DELETE (only DRAFT) ----------------
    public void delete(Long id) {

        StockTaking st = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StockTaking not found"));

        if (st.getStatus() != StockTaking.StockStatus.DRAFT) {
            throw new IllegalStateException(
                "Only DRAFT stock entries can be deleted"
            );
        }

        st.setActive(false);
        repo.save(st);
    }

    // ---------------- APPROVE ----------------
    public void approve(Long id, Authentication auth) {

        StockTaking st = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StockTaking not found"));

        if (st.getStatus() != StockTaking.StockStatus.DRAFT) {
            throw new IllegalStateException(
                "Only DRAFT stock can be approved"
            );
        }

        st.setStatus(StockTaking.StockStatus.APPROVED);
        st.setApprovedBy(auth.getName()); // ✅ manager username
        repo.save(st);

        // 🔔 Notify STAFF (creator)
        notificationService.send(
            st.getCreatedBy(),
            "Stock Audit Approved",
            "Stock audit #" + st.getId() + " has been approved. You may apply stock.",
            NotificationType.INFO,
            "STOCK_TAKING",
            st.getId()
        );
    }

    // ---------------- APPLY ----------------
    @Transactional
    public void apply(Long id, Authentication auth) {

        StockTaking st = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StockTaking not found"));

        if (st.getStatus() == StockTaking.StockStatus.APPLIED) {
            throw new IllegalStateException("Stock already applied");
        }

        if (st.getStatus() != StockTaking.StockStatus.APPROVED) {
            throw new IllegalStateException(
                "Stock must be approved before applying"
            );
        }

        Product product = st.getProduct();
        product.setStock(st.getPhysicalStock());

        st.setStatus(StockTaking.StockStatus.APPLIED);

        productRepo.save(product);
        repo.save(st);

        // 🔔 Notify STAFF
        notificationService.send(
            st.getCreatedBy(),
            "Stock Applied",
            "Stock audit #" + st.getId() + " has been applied successfully.",
            NotificationType.INFO,
            "STOCK_TAKING",
            st.getId()
        );

        // 🔔 Optional: notify approver
        if (st.getApprovedBy() != null) {
            notificationService.send(
                st.getApprovedBy(),
                "Stock Adjustment Applied",
                "Stock audit #" + st.getId() + " was applied by staff.",
                NotificationType.INFO,
                "STOCK_TAKING",
                st.getId()
            );
        }
    }
}
