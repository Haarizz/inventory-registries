package com.inventory.registries.product;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsByCodeAndActiveTrue(String code);

    List<Product> findByActiveTrue();

    Optional<Product> findByIdAndActiveTrue(Long id);
}
