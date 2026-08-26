package com.securevault.backend.dto;

import com.securevault.backend.entity.PermissionLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SharedCredentialResponse {

    private Long shareId;

    private Long credentialId;

    private String title;

    private String website;

    private String username;

    private String password;

    private String category;

    private String notes;

    private String sharedBy;

    private LocalDateTime sharedAt;

    private LocalDateTime expiresAt;

    // Permission granted to the recipient
    private PermissionLevel permissionLevel;
}