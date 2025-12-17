package com.inventory.registries.subdepartment;

import java.util.List;

import org.springframework.stereotype.Service;

import com.inventory.registries.common.exception.DuplicateResourceException;
import com.inventory.registries.common.exception.ResourceNotFoundException;
import com.inventory.registries.department.Department;
import com.inventory.registries.department.DepartmentRepository;

@Service
public class SubDepartmentService {

    private final SubDepartmentRepository repo;
    private final DepartmentRepository departmentRepo;

    public SubDepartmentService(
            SubDepartmentRepository repo,
            DepartmentRepository departmentRepo) {
        this.repo = repo;
        this.departmentRepo = departmentRepo;
    }

    // CREATE
    public SubDepartment create(Long departmentId, SubDepartment subDepartment) {

        if (repo.existsByNameIgnoreCaseAndDepartmentIdAndActiveTrue(
                subDepartment.getName(), departmentId)) {
            throw new DuplicateResourceException("SubDepartment already exists");
        }

        Department department = departmentRepo.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        subDepartment.setDepartment(department);
        subDepartment.setActive(true);

        return repo.save(subDepartment);
    }

    // UPDATE
    public SubDepartment update(Long id, SubDepartment data) {

        SubDepartment sub = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubDepartment not found"));

        sub.setName(data.getName());
        return repo.save(sub);
    }

    // LIST
    public List<SubDepartment> list(Long departmentId) {
        return repo.findByDepartmentIdAndActiveTrue(departmentId);
    }

    // DELETE (soft)
    public void delete(Long id) {

        SubDepartment sub = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubDepartment not found"));

        sub.setActive(false);
        repo.save(sub);
    }
}
