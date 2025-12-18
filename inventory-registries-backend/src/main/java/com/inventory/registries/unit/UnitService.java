package com.inventory.registries.unit;

import java.util.List;

import org.springframework.stereotype.Service;

import com.inventory.registries.common.exception.DuplicateResourceException;
import com.inventory.registries.common.exception.ResourceNotFoundException;

@Service
public class UnitService {

    private final UnitRepository repo;

    public UnitService(UnitRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public Unit create(Unit unit) {
        String name = unit.getName().trim();

        if (repo.existsByNameIgnoreCaseAndActiveTrue(name)) {
            throw new DuplicateResourceException("Unit already exists");
        }

        unit.setName(name);
        unit.setActive(true);
        return repo.save(unit);
    }

    // UPDATE
    public Unit update(Long id, Unit data) {

        Unit unit = repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found"));

        String newName = data.getName().trim();

        if (!unit.getName().equalsIgnoreCase(newName)
                && repo.existsByNameIgnoreCaseAndActiveTrue(newName)) {
            throw new DuplicateResourceException("Unit already exists");
        }

        unit.setName(newName);
        return repo.save(unit);
    }

    // LIST
    public List<Unit> list() {
        return repo.findAllByActiveTrue();
    }

    // DELETE (SOFT)
    public void delete(Long id) {

        Unit unit = repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found"));

        unit.setActive(false);
        repo.save(unit);
    }
}
