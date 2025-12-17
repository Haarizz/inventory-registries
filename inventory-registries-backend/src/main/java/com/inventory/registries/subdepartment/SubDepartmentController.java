package com.inventory.registries.subdepartment;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sub-departments")
public class SubDepartmentController {

    private final SubDepartmentService service;

    public SubDepartmentController(SubDepartmentService service) {
        this.service = service;
    }

    @PostMapping("/department/{departmentId}")
    public SubDepartment create(
            @PathVariable Long departmentId,
            @RequestBody SubDepartment subDepartment) {
        return service.create(departmentId, subDepartment);
    }

    @PutMapping("/{id}")
    public SubDepartment update(
            @PathVariable Long id,
            @RequestBody SubDepartment subDepartment) {
        return service.update(id, subDepartment);
    }

    @GetMapping("/department/{departmentId}")
    public List<SubDepartment> list(
            @PathVariable Long departmentId) {
        return service.list(departmentId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
