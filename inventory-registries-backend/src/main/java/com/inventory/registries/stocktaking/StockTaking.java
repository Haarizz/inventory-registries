package com.inventory.registries.stocktaking;

import com.inventory.registries.common.Auditable;
import com.inventory.registries.product.Product;

import jakarta.persistence.*;

@Entity
@Table(name = "stock_taking")
public class StockTaking extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer systemStock;

    @Column(nullable = false)
    private Integer physicalStock;

    @Column(nullable = false)
    private Integer variance;

    @Column(nullable = false)
    private boolean active = true;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public Integer getSystemStock() {
		return systemStock;
	}

	public void setSystemStock(Integer systemStock) {
		this.systemStock = systemStock;
	}

	public Integer getPhysicalStock() {
		return physicalStock;
	}

	public void setPhysicalStock(Integer physicalStock) {
		this.physicalStock = physicalStock;
	}

	public Integer getVariance() {
		return variance;
	}

	public void setVariance(Integer variance) {
		this.variance = variance;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

    // getters & setters
    
    
}
