package com.inventory.registries.unit;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/units")
public class UnitController {

    private final UnitService service;

    public UnitController(UnitService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<Unit> create(@RequestBody Unit unit) {
        return ResponseEntity.ok(service.create(unit));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<Unit> update(
            @PathVariable Long id,
            @RequestBody Unit unit) {

        return ResponseEntity.ok(service.update(id, unit));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','SUPERVISOR','ACCOUNTANT')")
    public ResponseEntity<List<Unit>> list() {
        return ResponseEntity.ok(service.list());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
