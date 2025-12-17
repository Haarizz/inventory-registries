package com.inventory.registries.pricelevel;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PriceLevelRepository extends JpaRepository<PriceLevel, Long> {

    List<PriceLevel> findByProductIdAndActiveTrue(Long productId);

    boolean existsByProductIdAndNameIgnoreCaseAndActiveTrue(
            Long productId, String name);
}
