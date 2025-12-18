package com.inventory.registries.unit;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UnitRepository extends JpaRepository<Unit, Long> {

    boolean existsByNameIgnoreCaseAndActiveTrue(String name);

    List<Unit> findAllByActiveTrue();

    Optional<Unit> findByIdAndActiveTrue(Long id);

    boolean existsByIdAndActiveTrue(Long id);
}
