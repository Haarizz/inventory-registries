package com.inventory.registries.subdepartment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SubDepartmentRepository extends JpaRepository<SubDepartment, Long> {

    List<SubDepartment> findByDepartmentIdAndActiveTrue(Long departmentId);

    boolean existsByNameIgnoreCaseAndDepartmentIdAndActiveTrue(
        String name, Long departmentId
    );
}
