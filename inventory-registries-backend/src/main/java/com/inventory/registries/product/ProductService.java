package com.inventory.registries.product;

import java.util.List;

import org.springframework.stereotype.Service;

import com.inventory.registries.brand.Brand;
import com.inventory.registries.brand.BrandRepository;
import com.inventory.registries.common.exception.DuplicateResourceException;
import com.inventory.registries.common.exception.ResourceNotFoundException;
import com.inventory.registries.product.dto.ProductRequest;
import com.inventory.registries.subdepartment.SubDepartment;
import com.inventory.registries.subdepartment.SubDepartmentRepository;
import com.inventory.registries.unit.Unit;
import com.inventory.registries.unit.UnitRepository;

@Service
public class ProductService {

    private final ProductRepository repo;
    private final BrandRepository brandRepo;
    private final SubDepartmentRepository subDeptRepo;
    private final UnitRepository unitRepo;

    public ProductService(ProductRepository repo,
                          BrandRepository brandRepo,
                          SubDepartmentRepository subDeptRepo,
                          UnitRepository unitRepo) {
        this.repo = repo;
        this.brandRepo = brandRepo;
        this.subDeptRepo = subDeptRepo;
        this.unitRepo = unitRepo;
    }

    // ✅ CREATE
    public Product create(ProductRequest req) {

        if (repo.existsByCodeIgnoreCase(req.getCode())) {
            throw new DuplicateResourceException("Product code already exists");
        }

        Product product = mapToEntity(req, new Product());
        return repo.save(product);
    }

    // ✅ UPDATE
    public Product update(Long id, ProductRequest req) {

        Product product = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        mapToEntity(req, product);
        return repo.save(product);
    }



    // ✅ DELETE (soft delete)
    public void delete(Long id) {

        Product product = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setActive(false);
        repo.save(product);
    }

    // 🔁 MAPPING (single responsibility)
    private Product mapToEntity(ProductRequest req, Product product) {

        Brand brand = brandRepo.findById(req.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

        SubDepartment subDepartment = subDeptRepo.findById(req.getSubDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("SubDepartment not found"));

        Unit unit = unitRepo.findById(req.getUnitId())
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found"));

     // inside mapToEntity()
        product.setCode(req.getCode().trim().toUpperCase());
        product.setName(req.getName());
        product.setBrand(brand);
        product.setSubDepartment(subDepartment);
        product.setUnit(unit);

        product.setSellingPrice(req.getSellingPrice());
        product.setCostPrice(req.getCostPrice());
        product.setStock(req.getStock());

        product.setReorderLevel(
            req.getReorderLevel() != null ? req.getReorderLevel() : 10
        );

        // only set active on create
        if (product.getId() == null) {
            product.setActive(true);
        }


        return product;
    }
    public List<Product> list() {
        return repo.findByActiveTrue();
    }


}
