package com.inventory.registries.department;

import java.util.List;

import org.springframework.stereotype.Service;

import com.inventory.registries.common.exception.DuplicateResourceException;
import com.inventory.registries.common.exception.ResourceNotFoundException;
import com.inventory.registries.subdepartment.SubDepartmentRepository;

@Service
public class DepartmentService {

    private final DepartmentRepository repo;
    private final SubDepartmentRepository subRepo;

    public DepartmentService(DepartmentRepository repo,
                             SubDepartmentRepository subRepo) {
        this.repo = repo;
        this.subRepo = subRepo;
    }

    public Department create(Department department) {
        String name = department.getName().trim();

        if (repo.existsByNameIgnoreCaseAndActiveTrue(name)) {
            throw new DuplicateResourceException("Department already exists");
        }

        department.setName(name);
        department.setActive(true);
        return repo.save(department);
    }

    public Department update(Long id, Department data) {
        Department dept = repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        String newName = data.getName().trim();

        if (!dept.getName().equalsIgnoreCase(newName)
                && repo.existsByNameIgnoreCaseAndActiveTrue(newName)) {
            throw new DuplicateResourceException("Department already exists");
        }

        dept.setName(newName);
        return repo.save(dept);
    }

    public List<Department> list() {
        return repo.findAllByActiveTrue();
    }

    public void delete(Long id) {
        Department dept = repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        if (subRepo.existsByIdAndActiveTrue(id)) {
            throw new IllegalStateException(
                "Cannot delete department with active sub-departments"
            );
        }

        dept.setActive(false);
        repo.save(dept);
    }
}
