package com.devicemanagement.repository;

import com.devicemanagement.model.Category;
import com.devicemanagement.model.Device;
import com.devicemanagement.model.DeviceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    Optional<Device> findBySerialNumber(String serialNumber);
    boolean existsBySerialNumber(String serialNumber);
    List<Device> findByStatus(DeviceStatus status);
    List<Device> findByCategory(Category category);
    List<Device> findByAssignedToId(Long userId);
}