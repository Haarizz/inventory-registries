package com.inventory.registries.product.dto;

import jakarta.validation.constraints.*;

public class ProductRequest {

    @NotBlank
    private String code;

    @NotBlank
    private String name;

    @NotNull
    private Long brandId;

    @NotNull
    private Long unitId;

    @NotNull
    private Long subDepartmentId;

    @NotNull
    @Positive
    private Double sellingPrice;

    @NotNull
    @PositiveOrZero
    private Double costPrice;

    @PositiveOrZero
    private Integer stock;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getBrandId() {
		return brandId;
	}

	public void setBrandId(Long brandId) {
		this.brandId = brandId;
	}

	public Long getUnitId() {
		return unitId;
	}

	public void setUnitId(Long unitId) {
		this.unitId = unitId;
	}

	public Long getSubDepartmentId() {
		return subDepartmentId;
	}

	public void setSubDepartmentId(Long subDepartmentId) {
		this.subDepartmentId = subDepartmentId;
	}

	public Double getSellingPrice() {
		return sellingPrice;
	}

	public void setSellingPrice(Double sellingPrice) {
		this.sellingPrice = sellingPrice;
	}

	public Double getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(Double costPrice) {
		this.costPrice = costPrice;
	}

	public Integer getStock() {
		return stock;
	}

	public void setStock(Integer stock) {
		this.stock = stock;
	}

}
