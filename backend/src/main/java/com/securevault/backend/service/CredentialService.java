package com.securevault.backend.service;

import com.securevault.backend.dto.AuthResponse;
import com.securevault.backend.dto.CreateCredentialRequest;
import com.securevault.backend.dto.CredentialResponse;
import com.securevault.backend.dto.RevealPasswordRequest;
import com.securevault.backend.dto.RevealPasswordResponse;

import java.util.List;

public interface CredentialService {

    AuthResponse addCredential(CreateCredentialRequest request);

    List<CredentialResponse> getAllCredentials();

    CredentialResponse getCredential(Long id);

    AuthResponse updateCredential(
            Long id,
            CreateCredentialRequest request
    );

    AuthResponse deleteCredential(Long id);

    RevealPasswordResponse revealPassword(
            Long id,
            RevealPasswordRequest request
    );
}