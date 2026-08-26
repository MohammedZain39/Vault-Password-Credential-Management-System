package com.securevault.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuspiciousActivityResponse {

    private Long id;

    private String activityType;

    private String description;

    private LocalDateTime detectedAt;

    private String status;
}