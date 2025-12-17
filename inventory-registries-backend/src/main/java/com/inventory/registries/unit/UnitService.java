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
        if (repo.existsByNameIgnoreCase(unit.getName())) {
            throw new DuplicateResourceException("Unit already exists");
        }
        unit.setActive(true);
        return repo.save(unit);
    }

    // UPDATE
    public Unit update(Long id, Unit data) {
        Unit unit = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found"));

        unit.setName(data.getName());
        return repo.save(unit);
    }

    // LIST
    public List<Unit> list() {
        return repo.findByActiveTrue();
    }

    // DELETE (soft)
    public void delete(Long id) {
        Unit unit = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found"));

        unit.setActive(false);
        repo.save(unit);
    }
}
