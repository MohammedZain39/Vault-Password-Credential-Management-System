package com.securevault.backend.service;

import com.securevault.backend.dto.SuspiciousActivityResponse;

import java.util.List;

public interface SuspiciousActivityService {

    void analyzeLoginAttempt(
            String email,
            boolean successful
    );

    List<SuspiciousActivityResponse>
    getMySuspiciousActivities();
}