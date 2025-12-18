package com.inventory.registries.security;

public enum Role {

    // --- Core system roles ---
    SUPER_ADMIN,   // Full system access
    ADMIN,         // Admin-level access

    // --- Operational roles ---
    MANAGER,       // Manages operations
    SUPERVISOR,    // Oversees staff
    STAFF,         // General staff / employee
    CASHIER,       // POS & billing

    // --- Finance & audit ---
    ACCOUNTANT,    // Financial operations
    AUDITOR        // Read-only audit access
}
