package com.inventory.registries.brand;

import java.util.List;

import org.springframework.stereotype.Service;

import com.inventory.registries.common.exception.DuplicateResourceException;
import com.inventory.registries.common.exception.ResourceNotFoundException;

@Service
public class BrandService {

    private final BrandRepository repo;

    public BrandService(BrandRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public Brand create(Brand brand) {
        if (repo.existsByNameIgnoreCase(brand.getName())) {
            throw new DuplicateResourceException("Brand already exists");
        }
        brand.setActive(true);
        return repo.save(brand);
    }

    // UPDATE
    public Brand update(Long id, Brand data) {
        Brand brand = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

        brand.setName(data.getName());
        return repo.save(brand);
    }

    // LIST
    public List<Brand> list() {
        return repo.findByActiveTrue();
    }

    // DELETE (soft)
    public void delete(Long id) {
        Brand brand = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

        brand.setActive(false);
        repo.save(brand);
    }
}
