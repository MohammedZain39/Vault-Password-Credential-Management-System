package com.securevault.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginActivityReportResponse {

    private long totalAttempts;

    private long successfulLogins;

    private long failedLogins;
}