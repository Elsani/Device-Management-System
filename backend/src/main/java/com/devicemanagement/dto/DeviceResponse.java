package com.devicemanagement.dto;

import com.devicemanagement.model.Category;
import com.devicemanagement.model.DeviceStatus;

import java.time.LocalDate;

public class DeviceResponse {

    private Long id;
    private String serialNumber;
    private String name;
    private Category category;
    private DeviceStatus status;
    private LocalDate purchaseDate;
    private AssignedUserDto assignedTo;

    public DeviceResponse() {}

    public DeviceResponse(Long id, String serialNumber, String name, Category category, DeviceStatus status, LocalDate purchaseDate, AssignedUserDto assignedTo) {
        this.id = id;
        this.serialNumber = serialNumber;
        this.name = name;
        this.category = category;
        this.status = status;
        this.purchaseDate = purchaseDate;
        this.assignedTo = assignedTo;
    }

    public static class AssignedUserDto {
        private Long id;
        private String fullName;
        private String email;

        public AssignedUserDto() {}
        public AssignedUserDto(Long id, String fullName, String email) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public DeviceStatus getStatus() { return status; }
    public void setStatus(DeviceStatus status) { this.status = status; }
    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }
    public AssignedUserDto getAssignedTo() { return assignedTo; }
    public void setAssignedTo(AssignedUserDto assignedTo) { this.assignedTo = assignedTo; }
}
