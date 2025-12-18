package com.inventory.registries.product;

import com.inventory.registries.product.dto.ProductRequest;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // LIST (ACTIVE ONLY)
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','SUPERVISOR','ACCOUNTANT','STAFF')")
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // CREATE
    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<Product> create(
            @Valid @RequestBody ProductRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    // UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<Product> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    // DELETE (SOFT)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
