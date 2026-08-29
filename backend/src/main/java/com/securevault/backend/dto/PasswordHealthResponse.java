package com.securevault.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordHealthResponse {

    private long totalCredentials;

    private long strongPasswords;

    private long mediumPasswords;

    private long weakPasswords;

    private int healthScore;
}