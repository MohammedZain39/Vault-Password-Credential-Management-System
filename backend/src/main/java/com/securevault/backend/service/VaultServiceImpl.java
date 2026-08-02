package com.securevault.backend.service;

import com.securevault.backend.dto.AuthResponse;
import com.securevault.backend.dto.CreatePinRequest;
import com.securevault.backend.dto.VerifyPinRequest;
import com.securevault.backend.entity.User;
import com.securevault.backend.entity.VaultPin;
import com.securevault.backend.repository.UserRepository;
import com.securevault.backend.repository.VaultPinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.securevault.backend.dto.VaultStatusResponse;

@Service
@RequiredArgsConstructor
public class VaultServiceImpl implements VaultService {

    private final VaultPinRepository vaultPinRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public AuthResponse createPin(CreatePinRequest request) {

        User user = getLoggedInUser();

        if (vaultPinRepository.existsByUser(user)) {
            throw new RuntimeException("Vault PIN already created.");
        }

        VaultPin vaultPin = VaultPin.builder()
                .user(user)
                .pin(passwordEncoder.encode(request.getPin()))
                .build();

        vaultPinRepository.save(vaultPin);

        return new AuthResponse("Vault PIN created successfully.");
    }

    @Override
    public AuthResponse verifyPin(VerifyPinRequest request) {

        validatePin(request.getPin());

        return new AuthResponse("Vault unlocked successfully.");

    }
    @Override
    public VaultStatusResponse getVaultStatus() {

        User user = getLoggedInUser();

        boolean hasPin = vaultPinRepository.existsByUser(user);

        return new VaultStatusResponse(hasPin);

    }
    @Override
    public void validatePin(String pin) {

        User user = getLoggedInUser();

        VaultPin vaultPin = vaultPinRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Vault PIN not found."));

        if (!passwordEncoder.matches(pin, vaultPin.getPin())) {
            throw new RuntimeException("Incorrect Vault PIN.");
        }

    }
}