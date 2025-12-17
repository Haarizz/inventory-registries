package com.inventory.registries.unit;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UnitRepository extends JpaRepository<Unit, Long> {

    boolean existsByNameIgnoreCase(String name);

    List<Unit> findByActiveTrue();
}
