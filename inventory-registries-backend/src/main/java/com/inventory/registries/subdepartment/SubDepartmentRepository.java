package com.inventory.registries.subdepartment;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SubDepartmentRepository extends JpaRepository<SubDepartment, Long> {

    boolean existsByNameIgnoreCaseAndDepartmentIdAndActiveTrue(
        String name, Long departmentId
    );

    List<SubDepartment> findAllByActiveTrue();

    List<SubDepartment> findByDepartmentIdAndActiveTrue(Long departmentId);

    Optional<SubDepartment> findByIdAndActiveTrue(Long id);

    boolean existsByIdAndActiveTrue(Long id);
}

