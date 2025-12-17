package com.inventory.registries.pricelevel;

import java.util.List;

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

        if (repo.existsByProductIdAndNameIgnoreCaseAndActiveTrue(
                productId, data.getName())) {
            throw new DuplicateResourceException("Price level already exists");
        }

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        data.setProduct(product);
        data.setActive(true);

        return repo.save(data);
    }

    // LIST (by product)
    public List<PriceLevel> list(Long productId) {
        return repo.findByProductIdAndActiveTrue(productId);
    }

    // UPDATE
    public PriceLevel update(Long id, PriceLevel data) {

        PriceLevel pl = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Price level not found"));

        pl.setName(data.getName());
        pl.setPrice(data.getPrice());

        return repo.save(pl);
    }

    // DELETE (soft)
    public void delete(Long id) {

        PriceLevel pl = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Price level not found"));

        pl.setActive(false);
        repo.save(pl);
    }
}
