package com.inventory.registries.unit;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/units")
public class UnitController {

    private final UnitService service;

    public UnitController(UnitService service) {
        this.service = service;
    }

    @PostMapping
    public Unit create(@RequestBody Unit unit) {
        return service.create(unit);
    }

    @PutMapping("/{id}")
    public Unit update(@PathVariable Long id, @RequestBody Unit unit) {
        return service.update(id, unit);
    }

    @GetMapping
    public List<Unit> list() {
        return service.list();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
