package com.inventory.registries.subdepartment;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sub-departments")
public class SubDepartmentController {

    private final SubDepartmentService service;
    private final SubDepartmentRepository subDepartmentRepo;

    public SubDepartmentController(
            SubDepartmentService service,
            SubDepartmentRepository subDepartmentRepo
    ) {
        this.service = service;
        this.subDepartmentRepo = subDepartmentRepo;
    }

    // CREATE
    @PostMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public SubDepartment create(
            @PathVariable Long departmentId,
            @RequestBody SubDepartment subDepartment) {
        return service.create(departmentId, subDepartment);
    }

    // UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public SubDepartment update(
            @PathVariable Long id,
            @RequestBody SubDepartment subDepartment) {
        return service.update(id, subDepartment);
    }

    // LIST BY DEPARTMENT
    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MANAGER','STAFF')")
    public List<SubDepartment> list(
            @PathVariable Long departmentId) {
        return service.list(departmentId);
    }

    // LIST ALL ACTIVE
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','MANAGER','STAFF')")
    public List<SubDepartment> getAllActive() {
        return subDepartmentRepo.findAllByActiveTrue();
    }

    // DELETE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

