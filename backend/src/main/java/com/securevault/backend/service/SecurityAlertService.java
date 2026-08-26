package com.securevault.backend.service;

import com.securevault.backend.dto.SecurityAlertResponse;

import java.util.List;

public interface SecurityAlertService {

    void createAlertForSuspiciousActivity(
            Long suspiciousActivityId
    );

    List<SecurityAlertResponse> getMyAlerts();
}