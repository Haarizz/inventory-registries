package com.inventory.registries.brand;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    private final BrandService service;

    public BrandController(BrandService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<Brand> create(@RequestBody Brand brand) {
        return ResponseEntity.ok(service.create(brand));
    }

    // UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<Brand> update(
            @PathVariable Long id,
            @RequestBody Brand brand) {

        return ResponseEntity.ok(service.update(id, brand));
    }

    // LIST (ACTIVE ONLY)
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','SUPERVISOR','ACCOUNTANT')")
    public ResponseEntity<List<Brand>> list() {
        return ResponseEntity.ok(service.list());
    }

    // DELETE (SOFT)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
