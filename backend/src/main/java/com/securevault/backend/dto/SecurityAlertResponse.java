package com.securevault.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SecurityAlertResponse {

    private Long id;

    private String alertType;

    private String message;

    private String severity;

    private String status;

    private LocalDateTime createdAt;
}