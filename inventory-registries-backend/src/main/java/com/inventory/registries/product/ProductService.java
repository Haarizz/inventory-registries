package com.inventory.registries.product;

import com.inventory.registries.brand.Brand;
import com.inventory.registries.brand.BrandRepository;
import com.inventory.registries.pricelevel.PriceLevelRepository;
import com.inventory.registries.product.dto.ProductRequest;
import com.inventory.registries.stocktaking.StockTakingRepository;
import com.inventory.registries.subdepartment.SubDepartment;
import com.inventory.registries.subdepartment.SubDepartmentRepository;
import com.inventory.registries.unit.Unit;
import com.inventory.registries.unit.UnitRepository;

import jakarta.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepo;
    private final BrandRepository brandRepo;
    private final UnitRepository unitRepo;
    private final SubDepartmentRepository subDeptRepo;
    private final StockTakingRepository stockTakingRepo;
    private final PriceLevelRepository priceLevelRepo;

    public ProductService(
            ProductRepository productRepo,
            BrandRepository brandRepo,
            UnitRepository unitRepo,
            SubDepartmentRepository subDeptRepo,
            StockTakingRepository stockTakingRepo,
            PriceLevelRepository priceLevelRepo
    ) {
        this.productRepo = productRepo;
        this.brandRepo = brandRepo;
        this.unitRepo = unitRepo;
        this.subDeptRepo = subDeptRepo;
        this.stockTakingRepo = stockTakingRepo;
        this.priceLevelRepo = priceLevelRepo;
    }

    // ---------------- CREATE ----------------
    public Product create(ProductRequest req) {

        // 🔒 Unique product code (active only)
        if (productRepo.existsByCodeAndActiveTrue(req.getCode())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Product code already exists"
            );
        }

        Brand brand = brandRepo.findByIdAndActiveTrue(req.getBrandId())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Brand"));

        Unit unit = unitRepo.findByIdAndActiveTrue(req.getUnitId())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Unit"));

        SubDepartment subDept = subDeptRepo.findByIdAndActiveTrue(req.getSubDepartmentId())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Category"));

        validatePrice(req.getSellingPrice(), req.getCostPrice());

        Product product = new Product();
        product.setCode(req.getCode().trim());
        product.setName(req.getName().trim());
        product.setSellingPrice(req.getSellingPrice());
        product.setCostPrice(req.getCostPrice());
        product.setStock(req.getStock());
        product.setBrand(brand);
        product.setUnit(unit);
        product.setSubDepartment(subDept);
        product.setActive(true);

        return productRepo.save(product);
    }

    // ---------------- UPDATE ----------------
    public Product update(Long id, ProductRequest req) {

        Product existing = productRepo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found"
                ));

        validatePrice(req.getSellingPrice(), req.getCostPrice());

        // ⚠️ Code is intentionally NOT updatable
        existing.setName(req.getName().trim());
        existing.setSellingPrice(req.getSellingPrice());
        existing.setCostPrice(req.getCostPrice());

        // ⚠️ TEMPORARY: stock update allowed (as per your comment)
        existing.setStock(req.getStock());

        return productRepo.save(existing);
    }

    // ---------------- DELETE (SAFE SOFT DELETE) ----------------
    @Transactional
    public void delete(Long id) {

        Product product = productRepo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found"
                ));

        if (stockTakingRepo.existsByProduct_IdAndActiveTrue(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete product. Stock Taking records exist."
            );
        }

        if (priceLevelRepo.existsByProduct_IdAndActiveTrue(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete product. Price Level records exist."
            );
        }

        product.setActive(false);
        productRepo.save(product);
    }

    // ---------------- LIST ----------------
    public List<Product> getAll() {
        return productRepo.findByActiveTrue();
    }

    // ---------------- RULES ----------------
    private void validatePrice(Double selling, Double cost) {
        if (selling < cost) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Selling price cannot be less than cost price"
            );
        }
    }
}
