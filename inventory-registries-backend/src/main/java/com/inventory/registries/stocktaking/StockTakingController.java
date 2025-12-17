package com.inventory.registries.stocktaking;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stock-taking")
public class StockTakingController {

    private final StockTakingService service;

    public StockTakingController(StockTakingService service) {
        this.service = service;
    }

    @PostMapping("/product/{productId}")
    public StockTaking create(
            @PathVariable Long productId,
            @RequestParam Integer physicalStock) {
        return service.create(productId, physicalStock);
    }

    @GetMapping
    public List<StockTaking> list() {
        return service.list();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
