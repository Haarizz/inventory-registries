package com.inventory.registries.notification;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    // ✅ LIST logged-in user's notifications
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','SUPERVISOR','ACCOUNTANT','STAFF')")
    public ResponseEntity<List<Notification>> myNotifications() {
        return ResponseEntity.ok(service.getMyNotifications());
    }

    // ✅ MARK AS READ
    @PutMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','SUPERVISOR','ACCOUNTANT','STAFF')")
    public ResponseEntity<Void> markRead(@PathVariable Long id) {
        service.markRead(id);
        return ResponseEntity.ok().build();
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','SUPERVISOR','ACCOUNTANT','STAFF')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
