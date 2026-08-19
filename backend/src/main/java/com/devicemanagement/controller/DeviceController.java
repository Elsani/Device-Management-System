package com.devicemanagement.controller;

import com.devicemanagement.dto.*;
import com.devicemanagement.model.Category;
import com.devicemanagement.model.DeviceStatus;
import com.devicemanagement.service.DeviceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    // 1. Krijimi i një pajisjeje (Vetëm ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DeviceResponse> createDevice(@Valid @RequestBody DeviceRequest request) {
        return new ResponseEntity<>(deviceService.createDevice(request), HttpStatus.CREATED);
    }

    // 2. Lista e pajisjeve me filtra (Për të gjithë përdoruesit e autentikuar)
    @GetMapping
    public ResponseEntity<List<DeviceResponse>> getAllDevices(
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) DeviceStatus status
    ) {
        return ResponseEntity.ok(deviceService.getAllDevices(category, status));
    }

    // 3. Detajet e një pajisjeje sipas ID-së
    @GetMapping("/{id}")
    public ResponseEntity<DeviceResponse> getDeviceById(@PathVariable Long id) {
        return ResponseEntity.ok(deviceService.getDeviceById(id));
    }

    // 4. Modifikimi i pajisjes (Vetëm ADMIN)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DeviceResponse> updateDevice(
            @PathVariable Long id,
            @Valid @RequestBody DeviceRequest request
    ) {
        return ResponseEntity.ok(deviceService.updateDevice(id, request));
    }

    // 5. Fshirja e pajisjes (Vetëm ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteDevice(@PathVariable Long id) {
        deviceService.deleteDevice(id);
        return ResponseEntity.ok(Map.of("message", "Pajisja me ID " + id + " u fshi me sukses"));
    }

    // 6. Caktimi i pajisjes te një punëtor (Vetëm ADMIN)
    @PostMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DeviceResponse> assignDevice(
            @PathVariable Long id,
            @Valid @RequestBody AssignDeviceRequest request
    ) {
        return ResponseEntity.ok(deviceService.assignDevice(id, request));
    }

    // 7. Kthimi i pajisjes në magazinë (Vetëm ADMIN)
    @PostMapping("/{id}/return")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DeviceResponse> returnDevice(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String notes = body != null ? body.get("notes") : "";
        return ResponseEntity.ok(deviceService.returnDevice(id, notes));
    }

    // 8. Historiku i plotë i lëvizjeve të pajisjes
    @GetMapping("/{id}/history")
    public ResponseEntity<List<AssignmentHistoryResponse>> getDeviceHistory(@PathVariable Long id) {
        return ResponseEntity.ok(deviceService.getDeviceHistory(id));
    }
}
