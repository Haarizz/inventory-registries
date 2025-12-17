package com.inventory.registries;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class InventoryRegistriesApplication {

	public static void main(String[] args) {
		SpringApplication.run(InventoryRegistriesApplication.class, args);
	}

}
