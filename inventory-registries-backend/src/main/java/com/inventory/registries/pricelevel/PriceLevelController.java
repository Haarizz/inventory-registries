package com.inventory.registries.pricelevel;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/price-levels")
public class PriceLevelController {

    private final PriceLevelService service;

    public PriceLevelController(PriceLevelService service) {
        this.service = service;
    }

    @PostMapping("/product/{productId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public PriceLevel create(
            @PathVariable Long productId,
            @RequestBody PriceLevel priceLevel) {
        return service.create(productId, priceLevel);
    }

    @GetMapping("/product/{productId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','SUPERVISOR','ACCOUNTANT')")
    public List<PriceLevel> list(@PathVariable Long productId) {
        return service.list(productId);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public PriceLevel update(
            @PathVariable Long id,
            @RequestBody PriceLevel priceLevel) {
        return service.update(id, priceLevel);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/product/{productId}/effective")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','SUPERVISOR','ACCOUNTANT')")
    public PriceLevel getEffectivePrice(@PathVariable Long productId) {
        return service.getEffectivePrice(productId);
    }
}

