package com.inventory.registries.pricelevel;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/price-levels")
public class PriceLevelController {

    private final PriceLevelService service;

    public PriceLevelController(PriceLevelService service) {
        this.service = service;
    }

    @PostMapping("/product/{productId}")
    public PriceLevel create(
            @PathVariable Long productId,
            @RequestBody PriceLevel priceLevel) {
        return service.create(productId, priceLevel);
    }

    @GetMapping("/product/{productId}")
    public List<PriceLevel> list(@PathVariable Long productId) {
        return service.list(productId);
    }

    @PutMapping("/{id}")
    public PriceLevel update(
            @PathVariable Long id,
            @RequestBody PriceLevel priceLevel) {
        return service.update(id, priceLevel);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
