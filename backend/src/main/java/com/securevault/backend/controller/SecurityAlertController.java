package com.securevault.backend.controller;

import com.securevault.backend.dto.SecurityAlertResponse;
import com.securevault.backend.service.SecurityAlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security/alerts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SecurityAlertController {

    private final SecurityAlertService securityAlertService;

    @GetMapping
    public ResponseEntity<List<SecurityAlertResponse>>
    getMyAlerts() {

        return ResponseEntity.ok(
                securityAlertService.getMyAlerts()
        );
    }
}