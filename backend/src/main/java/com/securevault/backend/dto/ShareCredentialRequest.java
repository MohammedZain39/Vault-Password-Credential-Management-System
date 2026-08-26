package com.securevault.backend.dto;

import com.securevault.backend.entity.PermissionLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShareCredentialRequest {

    private Long credentialId;

    private String email;

    private Integer expiryHours;

    private PermissionLevel permissionLevel;
}