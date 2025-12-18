package com.inventory.registries.stocktaking;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stock-taking")
public class StockTakingController {

    private final StockTakingService service;

    public StockTakingController(StockTakingService service) {
        this.service = service;
    }

    // CREATE (DRAFT)
    @PostMapping("/product/{productId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','SUPERVISOR','STAFF')")
    public ResponseEntity<StockTaking> create(
            @PathVariable Long productId,
            @RequestParam Integer physicalStock,
            Authentication authentication) {

        return ResponseEntity.ok(
            service.create(productId, physicalStock, authentication)
        );
    }

    // LIST (ACTIVE ONLY)
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','SUPERVISOR','ACCOUNTANT','STAFF')")
    public ResponseEntity<List<StockTaking>> list() {
        return ResponseEntity.ok(service.list());
    }

    // DELETE (ONLY DRAFT)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // APPROVE
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MANAGER')")
    public ResponseEntity<Void> approve(
            @PathVariable Long id,
            Authentication authentication) {

        service.approve(id, authentication);
        return ResponseEntity.ok().build();
    }

    // APPLY (UPDATES PRODUCT STOCK)
    @PostMapping("/{id}/apply")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<Void> apply(
            @PathVariable Long id,
            Authentication authentication) {

        service.apply(id, authentication);
        return ResponseEntity.ok().build();
    }
}
