package com.devicemanagement.dto;

import java.time.LocalDateTime;

public class AssignmentHistoryResponse {

    private Long id;
    private Long deviceId;
    private String deviceName;
    private String deviceSerialNumber;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private LocalDateTime assignedAt;
    private LocalDateTime returnedAt;
    private String notes;

    public AssignmentHistoryResponse() {}

    public AssignmentHistoryResponse(Long id, Long deviceId, String deviceName, String deviceSerialNumber,
                                     Long userId, String userFullName, String userEmail,
                                     LocalDateTime assignedAt, LocalDateTime returnedAt, String notes) {
        this.id = id;
        this.deviceId = deviceId;
        this.deviceName = deviceName;
        this.deviceSerialNumber = deviceSerialNumber;
        this.userId = userId;
        this.userFullName = userFullName;
        this.userEmail = userEmail;
        this.assignedAt = assignedAt;
        this.returnedAt = returnedAt;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getDeviceId() { return deviceId; }
    public void setDeviceId(Long deviceId) { this.deviceId = deviceId; }
    public String getDeviceName() { return deviceName; }
    public void setDeviceName(String deviceName) { this.deviceName = deviceName; }
    public String getDeviceSerialNumber() { return deviceSerialNumber; }
    public void setDeviceSerialNumber(String deviceSerialNumber) { this.deviceSerialNumber = deviceSerialNumber; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserFullName() { return userFullName; }
    public void setUserFullName(String userFullName) { this.userFullName = userFullName; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
    public LocalDateTime getReturnedAt() { return returnedAt; }
    public void setReturnedAt(LocalDateTime returnedAt) { this.returnedAt = returnedAt; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
