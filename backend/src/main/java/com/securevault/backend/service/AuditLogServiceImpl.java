package com.securevault.backend.service;

import com.securevault.backend.dto.AuditLogResponse;
import com.securevault.backend.entity.AuditLog;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.AuditLogRepository;
import com.securevault.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl
        implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Override
    public void recordAudit(
            String email,
            String action,
            String description) {

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {
            return;
        }

        AuditLog auditLog =
                AuditLog.builder()
                        .user(user)
                        .action(action)
                        .description(description)
                        .build();

        auditLogRepository.save(auditLog);
    }

    @Override
    public List<AuditLogResponse> getMyAuditLogs() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        return auditLogRepository
                .findByUserOrderByTimestampDesc(user)
                .stream()
                .map(log ->
                        AuditLogResponse.builder()
                                .id(log.getId())
                                .action(log.getAction())
                                .description(
                                        log.getDescription()
                                )
                                .timestamp(
                                        log.getTimestamp()
                                )
                                .build()
                )
                .toList();
    }
}