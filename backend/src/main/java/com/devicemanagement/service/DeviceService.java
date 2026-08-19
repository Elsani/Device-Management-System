package com.devicemanagement.service;

import com.devicemanagement.dto.*;
import com.devicemanagement.model.*;
import com.devicemanagement.repository.AssignmentHistoryRepository;
import com.devicemanagement.repository.DeviceRepository;
import com.devicemanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final AssignmentHistoryRepository assignmentHistoryRepository;

    public DeviceService(DeviceRepository deviceRepository,
                         UserRepository userRepository,
                         AssignmentHistoryRepository assignmentHistoryRepository) {
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
        this.assignmentHistoryRepository = assignmentHistoryRepository;
    }

    // 1. Krijimi i një pajisjeje të re
    public DeviceResponse createDevice(DeviceRequest request) {
        if (deviceRepository.existsBySerialNumber(request.getSerialNumber())) {
            throw new RuntimeException("Një pajisje me këtë numër serial ekziston tashmë: " + request.getSerialNumber());
        }

        Device device = Device.builder()
                .serialNumber(request.getSerialNumber())
                .name(request.getName())
                .category(request.getCategory())
                .status(DeviceStatus.AVAILABLE) // Statusi fillestar është gjithmonë AVAILABLE
                .purchaseDate(request.getPurchaseDate())
                .build();

        Device savedDevice = deviceRepository.save(device);
        return mapToDeviceResponse(savedDevice);
    }

    // 2. Marrja e të gjitha pajisjeve me filtra opsionalë
    public List<DeviceResponse> getAllDevices(Category category, DeviceStatus status) {
        List<Device> devices;
        if (category != null && status != null) {
            devices = deviceRepository.findByCategory(category).stream()
                    .filter(d -> d.getStatus() == status)
                    .collect(Collectors.toList());
        } else if (category != null) {
            devices = deviceRepository.findByCategory(category);
        } else if (status != null) {
            devices = deviceRepository.findByStatus(status);
        } else {
            devices = deviceRepository.findAll();
        }

        return devices.stream()
                .map(this::mapToDeviceResponse)
                .collect(Collectors.toList());
    }

    // 3. Marrja e një pajisjeje sipas ID-së
    public DeviceResponse getDeviceById(Long id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pajisja me ID " + id + " nuk u gjet"));
        return mapToDeviceResponse(device);
    }

    // 4. Përditësimi i pajisjes
    public DeviceResponse updateDevice(Long id, DeviceRequest request) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pajisja me ID " + id + " nuk u gjet"));

        // Nëse serial number po ndryshohet, verifiko që nuk ekziston në një pajisje tjetër
        if (!device.getSerialNumber().equals(request.getSerialNumber()) &&
                deviceRepository.existsBySerialNumber(request.getSerialNumber())) {
            throw new RuntimeException("Ky numër serial po përdoret tashmë nga një pajisje tjetër: " + request.getSerialNumber());
        }

        device.setSerialNumber(request.getSerialNumber());
        device.setName(request.getName());
        device.setCategory(request.getCategory());
        device.setPurchaseDate(request.getPurchaseDate());

        Device updatedDevice = deviceRepository.save(device);
        return mapToDeviceResponse(updatedDevice);
    }

    // 5. Fshirja e pajisjes
    public void deleteDevice(Long id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pajisja me ID " + id + " nuk u gjet"));

        if (device.getStatus() == DeviceStatus.ASSIGNED) {
            throw new RuntimeException("Pajisja nuk mund të fshihet sepse aktualisht është e caktuar te një punëtor!");
        }

        deviceRepository.delete(device);
    }

    // 6. Caktimi i pajisjes te një punëtor (Assign) + Regjistrimi në Historik
    @Transactional
    public DeviceResponse assignDevice(Long deviceId, AssignDeviceRequest request) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Pajisja me ID " + deviceId + " nuk u gjet"));

        if (device.getStatus() == DeviceStatus.ASSIGNED) {
            throw new RuntimeException("Pajisja është e caktuar tashmë te dikush tjetër!");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Përdoruesi me ID " + request.getUserId() + " nuk u gjet"));

        // Përditëso gjendjen e pajisjes
        device.setAssignedTo(user);
        device.setStatus(DeviceStatus.ASSIGNED);
        Device savedDevice = deviceRepository.save(device);

        // Krijimi i regjistrimit në tabelën e Historikut
        AssignmentHistory history = AssignmentHistory.builder()
                .device(savedDevice)
                .user(user)
                .assignedAt(LocalDateTime.now())
                .notes(request.getNotes())
                .build();
        assignmentHistoryRepository.save(history);

        return mapToDeviceResponse(savedDevice);
    }

    // 7. Kthimi i pajisjes në magazinë (Return)
    @Transactional
    public DeviceResponse returnDevice(Long deviceId, String notes) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Pajisja me ID " + deviceId + " nuk u gjet"));

        if (device.getStatus() != DeviceStatus.ASSIGNED || device.getAssignedTo() == null) {
            throw new RuntimeException("Kjo pajisje nuk është aktualisht e caktuar te asnjë punëtor!");
        }

        // Gjej historikun e fundit aktiv pa datë kthimi (returnedAt == null)
        List<AssignmentHistory> histories = assignmentHistoryRepository.findByDeviceIdOrderByAssignedAtDesc(deviceId);
        if (!histories.isEmpty()) {
            AssignmentHistory currentHistory = histories.get(0);
            currentHistory.setReturnedAt(LocalDateTime.now());
            if (notes != null && !notes.isBlank()) {
                currentHistory.setNotes(currentHistory.getNotes() != null ?
                        currentHistory.getNotes() + " | Kthimi: " + notes : "Kthimi: " + notes);
            }
            assignmentHistoryRepository.save(currentHistory);
        }

        // Liromë pajisjen
        device.setAssignedTo(null);
        device.setStatus(DeviceStatus.AVAILABLE);
        Device savedDevice = deviceRepository.save(device);

        return mapToDeviceResponse(savedDevice);
    }

    // 8. Marrja e të gjithë historikut të lëvizjeve për një pajisje
    public List<AssignmentHistoryResponse> getDeviceHistory(Long deviceId) {
        if (!deviceRepository.existsById(deviceId)) {
            throw new RuntimeException("Pajisja me ID " + deviceId + " nuk u gjet");
        }

        return assignmentHistoryRepository.findByDeviceIdOrderByAssignedAtDesc(deviceId).stream()
                .map(this::mapToHistoryResponse)
                .collect(Collectors.toList());
    }

    // Helper mapper metodat
    private DeviceResponse mapToDeviceResponse(Device device) {
        DeviceResponse.AssignedUserDto userDto = null;
        if (device.getAssignedTo() != null) {
            userDto = new DeviceResponse.AssignedUserDto(
                    device.getAssignedTo().getId(),
                    device.getAssignedTo().getFullName(),
                    device.getAssignedTo().getEmail()
            );
        }

        return new DeviceResponse(
                device.getId(),
                device.getSerialNumber(),
                device.getName(),
                device.getCategory(),
                device.getStatus(),
                device.getPurchaseDate(),
                userDto
        );
    }

    private AssignmentHistoryResponse mapToHistoryResponse(AssignmentHistory history) {
        return new AssignmentHistoryResponse(
                history.getId(),
                history.getDevice().getId(),
                history.getDevice().getName(),
                history.getDevice().getSerialNumber(),
                history.getUser().getId(),
                history.getUser().getFullName(),
                history.getUser().getEmail(),
                history.getAssignedAt(),
                history.getReturnedAt(),
                history.getNotes()
        );
    }
}
