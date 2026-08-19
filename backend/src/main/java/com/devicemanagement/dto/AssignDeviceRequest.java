package com.devicemanagement.dto;

import jakarta.validation.constraints.NotNull;

public class AssignDeviceRequest {

    @NotNull(message = "ID e përdoruesit është e detyrueshme")
    private Long userId;

    private String notes;

    public AssignDeviceRequest() {}

    public AssignDeviceRequest(Long userId, String notes) {
        this.userId = userId;
        this.notes = notes;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
