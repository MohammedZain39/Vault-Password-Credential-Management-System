package com.securevault.backend.repository;

import com.securevault.backend.entity.AuditLog;
import com.securevault.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUserOrderByTimestampDesc(
            User user
    );
}