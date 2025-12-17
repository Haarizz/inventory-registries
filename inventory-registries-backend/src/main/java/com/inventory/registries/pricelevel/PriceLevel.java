package com.inventory.registries.pricelevel;

import com.inventory.registries.common.Auditable;
import com.inventory.registries.product.Product;

import jakarta.persistence.*;

@Entity
@Table(
    name = "price_levels",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"product_id", "name"})
    }
)
public class PriceLevel extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String name; // Retail, Wholesale, etc.

    @Column(nullable = false)
    private Double price;

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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

    // getters & setters
}
