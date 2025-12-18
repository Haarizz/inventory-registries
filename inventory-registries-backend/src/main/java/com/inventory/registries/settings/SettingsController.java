package com.inventory.registries.settings;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.inventory.registries.security.Role;

@RestController
@RequestMapping("/api/settings/users")
public class SettingsController {

    private final SettingsService service;

    public SettingsController(SettingsService service) {
        this.service = service;
    }

    // GET USERS
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<List<UserSettingsDTO>> listUsers() {
        return ResponseEntity.ok(service.listUsers());
    }

    // UPDATE ROLE
    @PutMapping("/{id}/role")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<UserSettingsDTO> updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Role role = Role.valueOf(body.get("role"));
        return ResponseEntity.ok(service.updateRole(id, role));
    }
}
