package com.securevault.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogResponse {

    private Long id;

    private String action;

    private String description;

    private LocalDateTime timestamp;
}