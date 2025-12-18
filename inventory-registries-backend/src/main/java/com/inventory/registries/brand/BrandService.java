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
        String name = brand.getName().trim();

        if (repo.existsByNameIgnoreCaseAndActiveTrue(name)) {
            throw new DuplicateResourceException("Brand already exists");
        }

        brand.setName(name);
        brand.setActive(true);
        return repo.save(brand);
    }

    // UPDATE
    public Brand update(Long id, Brand data) {

        Brand brand = repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

        String newName = data.getName().trim();

        if (!brand.getName().equalsIgnoreCase(newName)
                && repo.existsByNameIgnoreCaseAndActiveTrue(newName)) {
            throw new DuplicateResourceException("Brand already exists");
        }

        brand.setName(newName);
        return repo.save(brand);
    }

    // LIST
    public List<Brand> list() {
        return repo.findAllByActiveTrue();
    }

    // DELETE (SOFT)
    public void delete(Long id) {

        Brand brand = repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

        brand.setActive(false);
        repo.save(brand);
    }
}

