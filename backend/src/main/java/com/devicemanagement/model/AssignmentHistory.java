package com.devicemanagement.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_history")
public class AssignmentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime assignedAt;

    private LocalDateTime returnedAt;

    private String notes;

    public AssignmentHistory() {}

    public AssignmentHistory(Long id, Device device, User user, LocalDateTime assignedAt, LocalDateTime returnedAt, String notes) {
        this.id = id;
        this.device = device;
        this.user = user;
        this.assignedAt = assignedAt;
        this.returnedAt = returnedAt;
        this.notes = notes;
    }

    public static AssignmentHistoryBuilder builder() {
        return new AssignmentHistoryBuilder();
    }

    public static class AssignmentHistoryBuilder {
        private Long id;
        private Device device;
        private User user;
        private LocalDateTime assignedAt;
        private LocalDateTime returnedAt;
        private String notes;

        public AssignmentHistoryBuilder id(Long id) { this.id = id; return this; }
        public AssignmentHistoryBuilder device(Device device) { this.device = device; return this; }
        public AssignmentHistoryBuilder user(User user) { this.user = user; return this; }
        public AssignmentHistoryBuilder assignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; return this; }
        public AssignmentHistoryBuilder returnedAt(LocalDateTime returnedAt) { this.returnedAt = returnedAt; return this; }
        public AssignmentHistoryBuilder notes(String notes) { this.notes = notes; return this; }

        public AssignmentHistory build() {
            return new AssignmentHistory(id, device, user, assignedAt, returnedAt, notes);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Device getDevice() { return device; }
    public void setDevice(Device device) { this.device = device; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getReturnedAt() { return returnedAt; }
    public void setReturnedAt(LocalDateTime returnedAt) { this.returnedAt = returnedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}