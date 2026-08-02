package com.securevault.backend.service;

import com.securevault.backend.dto.AuthResponse;
import com.securevault.backend.dto.CreatePinRequest;
import com.securevault.backend.dto.VerifyPinRequest;
import com.securevault.backend.dto.VaultStatusResponse;



public interface VaultService {

    AuthResponse createPin(CreatePinRequest request);

    AuthResponse verifyPin(VerifyPinRequest request);

    VaultStatusResponse getVaultStatus();

    void validatePin(String pin);
}
