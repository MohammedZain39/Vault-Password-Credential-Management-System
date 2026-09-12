package com.securevault.backend.controller;

import com.securevault.backend.dto.SecurityAnalyticsResponse;
import com.securevault.backend.service.SecurityAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/security")
@RequiredArgsConstructor

public class SecurityAnalyticsController {

    private final SecurityAnalyticsService
            securityAnalyticsService;


    @GetMapping("/analytics")
    public ResponseEntity<SecurityAnalyticsResponse>
    getSecurityAnalytics() {

        return ResponseEntity.ok(
                securityAnalyticsService
                        .getMySecurityAnalytics()
        );
    }
}