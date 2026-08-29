package com.securevault.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SecurityAnalyticsResponse {

    private long totalLogins;

    private long successfulLogins;

    private long failedLogins;

    private long suspiciousActivities;

    private long securityAlerts;

    private long unreadAlerts;
}