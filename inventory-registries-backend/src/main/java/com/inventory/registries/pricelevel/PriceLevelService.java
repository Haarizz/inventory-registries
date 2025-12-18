package com.inventory.registries.pricelevel;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.inventory.registries.common.exception.DuplicateResourceException;
import com.inventory.registries.common.exception.ResourceNotFoundException;
import com.inventory.registries.product.Product;
import com.inventory.registries.product.ProductRepository;

@Service
public class PriceLevelService {

    private final PriceLevelRepository repo;
    private final ProductRepository productRepo;

    public PriceLevelService(
            PriceLevelRepository repo,
            ProductRepository productRepo) {
        this.repo = repo;
        this.productRepo = productRepo;
    }

    // CREATE
    public PriceLevel create(Long productId, PriceLevel data) {

        if (data.getPriority() == null || data.getPriority() <= 0) {
            throw new IllegalArgumentException("Priority must be greater than 0");
        }

        Product product = productRepo.findByIdAndActiveTrue(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (repo.existsByProduct_IdAndPriorityAndActiveTrue(productId, data.getPriority())) {
            throw new DuplicateResourceException(
                    "Price level with same priority already exists");
        }

        if (repo.existsByProduct_IdAndNameIgnoreCaseAndActiveTrue(productId, data.getName())) {
            throw new DuplicateResourceException(
                    "Price level with same name already exists");
        }

        data.setProduct(product);
        data.setActive(true);

        return repo.save(data);
    }

    // LIST
    public List<PriceLevel> list(Long productId) {
        return repo.findByProduct_IdAndActiveTrue(productId);
    }

    // UPDATE
    public PriceLevel update(Long id, PriceLevel data) {

        PriceLevel pl = repo.findById(id)
                .filter(PriceLevel::getActive)
                .orElseThrow(() -> new ResourceNotFoundException("Price level not found"));

        if (data.getPriority() == null || data.getPriority() <= 0) {
            throw new IllegalArgumentException("Priority must be greater than 0");
        }

        Long productId = pl.getProduct().getId();

        if (!pl.getPriority().equals(data.getPriority())
                && repo.existsByProduct_IdAndPriorityAndActiveTrue(productId, data.getPriority())) {
            throw new DuplicateResourceException(
                    "Price level with same priority already exists");
        }

        if (!pl.getName().equalsIgnoreCase(data.getName())
                && repo.existsByProduct_IdAndNameIgnoreCaseAndActiveTrue(productId, data.getName())) {
            throw new DuplicateResourceException(
                    "Price level with same name already exists");
        }

        pl.setName(data.getName());
        pl.setPrice(data.getPrice());
        pl.setPriority(data.getPriority());

        return repo.save(pl);
    }

    // DELETE (SOFT)
    public void delete(Long id) {

        PriceLevel pl = repo.findById(id)
                .filter(PriceLevel::getActive)
                .orElseThrow(() -> new ResourceNotFoundException("Price level not found"));

        pl.setActive(false);
        repo.save(pl);
    }

    // ⭐ EFFECTIVE PRICE (LOWEST PRIORITY)
    public PriceLevel getEffectivePrice(Long productId) {

        return repo.findFirstByProduct_IdAndActiveTrueOrderByPriorityAsc(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No active price level found for product"));
    }
}

