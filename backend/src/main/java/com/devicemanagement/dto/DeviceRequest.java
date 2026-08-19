package com.devicemanagement.dto;

import com.devicemanagement.model.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class DeviceRequest {

    @NotBlank(message = "Numri serial është i detyrueshëm")
    private String serialNumber;

    @NotBlank(message = "Emri i pajisjes është i detyrueshëm")
    private String name;

    @NotNull(message = "Kategoria është e detyrueshme (LAPTOP, PHONE, MONITOR, ACCESSORY)")
    private Category category;

    private LocalDate purchaseDate;

    public DeviceRequest() {}

    public DeviceRequest(String serialNumber, String name, Category category, LocalDate purchaseDate) {
        this.serialNumber = serialNumber;
        this.name = name;
        this.category = category;
        this.purchaseDate = purchaseDate;
    }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }
}
