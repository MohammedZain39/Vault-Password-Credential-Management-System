package com.securevault.backend.controller;

import com.securevault.backend.dto.LoginActivityReportResponse;
import com.securevault.backend.dto.PasswordHealthResponse;
import com.securevault.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/password-health")
    public ResponseEntity<PasswordHealthResponse>
    getPasswordHealthReport() {

        return ResponseEntity.ok(
                reportService.getPasswordHealthReport()
        );
    }


    @GetMapping("/login-activity")
    public ResponseEntity<LoginActivityReportResponse>
    getLoginActivityReport() {

        return ResponseEntity.ok(
                reportService.getLoginActivityReport()
        );
    }
}