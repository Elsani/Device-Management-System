package com.devicemanagement.repository;

import com.devicemanagement.model.AssignmentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentHistoryRepository extends JpaRepository<AssignmentHistory, Long> {
    List<AssignmentHistory> findByDeviceIdOrderByAssignedAtDesc(Long deviceId);
    List<AssignmentHistory> findByUserIdOrderByAssignedAtDesc(Long userId);
}