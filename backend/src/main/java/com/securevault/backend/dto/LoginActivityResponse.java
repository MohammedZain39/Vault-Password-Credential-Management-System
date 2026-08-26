package com.securevault.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginActivityResponse {

    private Long id;

    private String email;

    private Boolean successful;

    private LocalDateTime loginTime;

    private String ipAddress;
}