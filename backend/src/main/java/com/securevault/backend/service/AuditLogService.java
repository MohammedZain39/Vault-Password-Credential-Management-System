package com.securevault.backend.service;

import com.securevault.backend.dto.AuditLogResponse;

import java.util.List;

public interface AuditLogService {

    void recordAudit(
            String email,
            String action,
            String description
    );

    List<AuditLogResponse> getMyAuditLogs();
}