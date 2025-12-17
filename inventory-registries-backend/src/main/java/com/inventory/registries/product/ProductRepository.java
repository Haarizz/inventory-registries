package com.inventory.registries.product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	List<Product> findByActiveTrue();

	boolean existsByCodeIgnoreCase(String code);
}
