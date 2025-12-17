package com.inventory.registries.stocktaking;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StockTakingRepository extends JpaRepository<StockTaking, Long> {

    List<StockTaking> findByActiveTrue();

    List<StockTaking> findByProductIdAndActiveTrue(Long productId);
}
