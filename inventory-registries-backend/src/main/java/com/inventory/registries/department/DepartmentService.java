package com.inventory.registries.department;

import java.util.List;

import org.springframework.stereotype.Service;

import com.inventory.registries.common.exception.DuplicateResourceException;
import com.inventory.registries.common.exception.ResourceNotFoundException;

@Service
public class DepartmentService {

    private final DepartmentRepository repo;

    public DepartmentService(DepartmentRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public Department create(Department department) {
        if (repo.existsByNameIgnoreCase(department.getName())) {
            throw new DuplicateResourceException("Department already exists");
        }
        department.setActive(true);
        return repo.save(department);
    }

    // UPDATE
    public Department update(Long id, Department data) {
        Department dept = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        dept.setName(data.getName());
        return repo.save(dept);
    }

    // LIST
    public List<Department> list() {
        return repo.findByActiveTrue();
    }

    // DELETE (soft)
    public void delete(Long id) {
        Department dept = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        dept.setActive(false);
        repo.save(dept);
    }
}
