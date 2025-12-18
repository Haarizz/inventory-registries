package com.inventory.registries.department;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    boolean existsByNameIgnoreCaseAndActiveTrue(String name);

    List<Department> findAllByActiveTrue();

    Optional<Department> findByIdAndActiveTrue(Long id);

    boolean existsByIdAndActiveTrue(Long id);
}
