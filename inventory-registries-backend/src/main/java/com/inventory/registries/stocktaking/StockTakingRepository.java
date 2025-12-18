package com.inventory.registries.stocktaking;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.inventory.registries.stocktaking.StockTaking.StockStatus;

public interface StockTakingRepository extends JpaRepository<StockTaking, Long> {

    List<StockTaking> findByActiveTrue();

    // ✅ Correct property traversal
    List<StockTaking> findByProduct_IdAndActiveTrue(Long productId);

    // ✅ Used for Product delete restriction
    boolean existsByProduct_IdAndActiveTrue(Long productId);

	boolean existsByProduct_IdAndStatusAndActiveTrue(Long productId, StockStatus draft);
}
