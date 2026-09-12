package com.securevault.backend.controller;

import com.securevault.backend.dto.SuspiciousActivityResponse;
import com.securevault.backend.service.SuspiciousActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security")
@RequiredArgsConstructor
public class SecurityController {

    private final SuspiciousActivityService
            suspiciousActivityService;

    @GetMapping("/suspicious")
    public ResponseEntity<List<SuspiciousActivityResponse>>
    getSuspiciousActivities() {

        return ResponseEntity.ok(
                suspiciousActivityService
                        .getMySuspiciousActivities()
        );
    }
}