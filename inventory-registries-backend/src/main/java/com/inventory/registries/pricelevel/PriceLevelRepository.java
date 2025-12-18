package com.inventory.registries.pricelevel;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PriceLevelRepository extends JpaRepository<PriceLevel, Long> {

    List<PriceLevel> findByProduct_IdAndActiveTrue(Long productId);

    boolean existsByProduct_IdAndNameIgnoreCaseAndActiveTrue(
            Long productId, String name);

    boolean existsByProduct_IdAndPriorityAndActiveTrue(
            Long productId, Integer priority);

    Optional<PriceLevel> findFirstByProduct_IdAndActiveTrueOrderByPriorityAsc(
            Long productId);

    boolean existsByProduct_IdAndActiveTrue(Long productId);
}


