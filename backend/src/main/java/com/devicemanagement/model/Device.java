package com.devicemanagement.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "devices")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String serialNumber;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeviceStatus status;

    private LocalDate purchaseDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_to_user_id")
    private User assignedTo;

    public Device() {}

    public Device(Long id, String serialNumber, String name, Category category, DeviceStatus status, LocalDate purchaseDate, User assignedTo) {
        this.id = id;
        this.serialNumber = serialNumber;
        this.name = name;
        this.category = category;
        this.status = status;
        this.purchaseDate = purchaseDate;
        this.assignedTo = assignedTo;
    }

    public static DeviceBuilder builder() {
        return new DeviceBuilder();
    }

    public static class DeviceBuilder {
        private Long id;
        private String serialNumber;
        private String name;
        private Category category;
        private DeviceStatus status;
        private LocalDate purchaseDate;
        private User assignedTo;

        public DeviceBuilder id(Long id) { this.id = id; return this; }
        public DeviceBuilder serialNumber(String serialNumber) { this.serialNumber = serialNumber; return this; }
        public DeviceBuilder name(String name) { this.name = name; return this; }
        public DeviceBuilder category(Category category) { this.category = category; return this; }
        public DeviceBuilder status(DeviceStatus status) { this.status = status; return this; }
        public DeviceBuilder purchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; return this; }
        public DeviceBuilder assignedTo(User assignedTo) { this.assignedTo = assignedTo; return this; }

        public Device build() {
            return new Device(id, serialNumber, name, category, status, purchaseDate, assignedTo);
        }
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

    public User getAssignedTo() { return assignedTo; }
    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }
}