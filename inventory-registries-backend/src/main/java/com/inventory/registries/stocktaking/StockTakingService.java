package com.inventory.registries.stocktaking;

import java.util.List;

import org.springframework.stereotype.Service;

import com.inventory.registries.common.exception.ResourceNotFoundException;
import com.inventory.registries.product.Product;
import com.inventory.registries.product.ProductRepository;

@Service
public class StockTakingService {

    private final StockTakingRepository repo;
    private final ProductRepository productRepo;

    public StockTakingService(
            StockTakingRepository repo,
            ProductRepository productRepo) {
        this.repo = repo;
        this.productRepo = productRepo;
    }

    // CREATE
    public StockTaking create(Long productId, Integer physicalStock) {

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        int systemStock = product.getStock();
        int variance = physicalStock - systemStock;

        StockTaking st = new StockTaking();
        st.setProduct(product);
        st.setSystemStock(systemStock);
        st.setPhysicalStock(physicalStock);
        st.setVariance(variance);
        st.setActive(true);

        return repo.save(st);
    }

    // LIST
    public List<StockTaking> list() {
        return repo.findByActiveTrue();
    }

    // DELETE (soft)
    public void delete(Long id) {
        StockTaking st = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StockTaking not found"));

        st.setActive(false);
        repo.save(st);
    }
}
