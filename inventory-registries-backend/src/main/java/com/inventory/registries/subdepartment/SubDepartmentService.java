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

    public SubDepartmentService(SubDepartmentRepository repo,
                                DepartmentRepository departmentRepo) {
        this.repo = repo;
        this.departmentRepo = departmentRepo;
    }

    // CREATE
    public SubDepartment create(Long departmentId, SubDepartment subDepartment) {

        Department department = departmentRepo.findByIdAndActiveTrue(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        String name = subDepartment.getName().trim();

        if (repo.existsByNameIgnoreCaseAndDepartmentIdAndActiveTrue(name, departmentId)) {
            throw new DuplicateResourceException("Sub-department already exists");
        }

        subDepartment.setName(name);
        subDepartment.setDepartment(department);
        subDepartment.setActive(true);

        return repo.save(subDepartment);
    }

    // UPDATE
    public SubDepartment update(Long id, SubDepartment data) {

        SubDepartment sub = repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sub-department not found"));

        String newName = data.getName().trim();
        Long deptId = sub.getDepartment().getId();

        if (!sub.getName().equalsIgnoreCase(newName)
                && repo.existsByNameIgnoreCaseAndDepartmentIdAndActiveTrue(newName, deptId)) {
            throw new DuplicateResourceException("Sub-department already exists");
        }

        sub.setName(newName);
        return repo.save(sub);
    }

    // LIST BY DEPARTMENT
    public List<SubDepartment> list(Long departmentId) {
        return repo.findByDepartmentIdAndActiveTrue(departmentId);
    }

    // DELETE (SOFT)
    public void delete(Long id) {

        SubDepartment sub = repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sub-department not found"));

        sub.setActive(false);
        repo.save(sub);
    }
    public List<SubDepartment> listAll() {
        return repo.findAllByActiveTrue();
    }

}
