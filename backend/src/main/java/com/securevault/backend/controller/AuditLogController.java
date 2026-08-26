package com.securevault.backend.controller;

import com.securevault.backend.dto.AuditLogResponse;
import com.securevault.backend.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security/audit-logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLogResponse>>
    getMyAuditLogs() {

        return ResponseEntity.ok(
                auditLogService.getMyAuditLogs()
        );
    }
}