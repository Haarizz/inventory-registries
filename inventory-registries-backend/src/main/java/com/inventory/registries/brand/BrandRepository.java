package com.inventory.registries.brand;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, Long> {

    boolean existsByNameIgnoreCaseAndActiveTrue(String name);

    List<Brand> findAllByActiveTrue();

    Optional<Brand> findByIdAndActiveTrue(Long id);

    boolean existsByIdAndActiveTrue(Long id);
}
