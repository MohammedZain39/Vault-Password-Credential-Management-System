package com.securevault.backend.service;

import com.securevault.backend.dto.AuthResponse;
import com.securevault.backend.dto.CreateCredentialRequest;
import com.securevault.backend.dto.CredentialResponse;
import com.securevault.backend.dto.RevealPasswordRequest;
import com.securevault.backend.dto.RevealPasswordResponse;
import com.securevault.backend.entity.Credential;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.CredentialRepository;
import com.securevault.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CredentialServiceImpl implements CredentialService {

    private final CredentialRepository credentialRepository;
    private final UserRepository userRepository;
    private final EncryptionService encryptionService;
    private final VaultService vaultService;

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    // ==========================
    // ADD CREDENTIAL
    // ==========================

    @Override
    public AuthResponse addCredential(CreateCredentialRequest request) {

        User user = getLoggedInUser();

        Credential credential = Credential.builder()
                .user(user)
                .title(request.getTitle())
                .website(request.getWebsite())
                .username(request.getUsername())
                .password(
                        encryptionService.encrypt(
                                request.getPassword()
                        )
                )
                .category(request.getCategory())
                .notes(request.getNotes())
                .build();

        credentialRepository.save(credential);

        return new AuthResponse(
                "Credential added successfully."
        );
    }

    // ==========================
    // GET ALL
    // ==========================

    @Override
    public List<CredentialResponse> getAllCredentials() {

        User user = getLoggedInUser();

        return credentialRepository.findByUser(user)
                .stream()
                .map(c -> CredentialResponse.builder()
                        .id(c.getId())
                        .title(c.getTitle())
                        .website(c.getWebsite())
                        .username(c.getUsername())

                        // Hidden on list screen
                        .password("********")

                        .category(c.getCategory())
                        .notes(c.getNotes())
                        .build())
                .toList();
    }

    // ==========================
    // GET ONE
    // ==========================

    @Override
    public CredentialResponse getCredential(Long id) {

        User user = getLoggedInUser();

        Credential credential = credentialRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Credential not found"));

        if (!credential.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        return CredentialResponse.builder()
                .id(credential.getId())
                .title(credential.getTitle())
                .website(credential.getWebsite())
                .username(credential.getUsername())

                // Never expose password here
                .password(
                        encryptionService.decrypt(
                                credential.getPassword()
                        )
                )

                .category(credential.getCategory())
                .notes(credential.getNotes())
                .build();
    }

    // ==========================
    // UPDATE
    // ==========================

    @Override
    public AuthResponse updateCredential(
            Long id,
            CreateCredentialRequest request
    ) {

        User user = getLoggedInUser();

        Credential credential = credentialRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Credential not found"));

        if (!credential.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        credential.setTitle(request.getTitle());
        credential.setWebsite(request.getWebsite());
        credential.setUsername(request.getUsername());

        credential.setPassword(
                encryptionService.encrypt(
                        request.getPassword()
                )
        );

        credential.setCategory(request.getCategory());
        credential.setNotes(request.getNotes());

        credentialRepository.save(credential);

        return new AuthResponse(
                "Credential updated successfully."
        );
    }

    // ==========================
    // DELETE
    // ==========================

    @Override
    public AuthResponse deleteCredential(Long id) {

        User user = getLoggedInUser();

        Credential credential = credentialRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Credential not found"));

        if (!credential.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        credentialRepository.delete(credential);

        return new AuthResponse(
                "Credential deleted successfully."
        );
    }

    // ==========================
    // REVEAL PASSWORD
    // ==========================

    @Override
    public RevealPasswordResponse revealPassword(
            Long id,
            RevealPasswordRequest request
    ) {

        User user = getLoggedInUser();

        Credential credential = credentialRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Credential not found"));

        if (!credential.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        // Verify Master PIN
        vaultService.validatePin(request.getPin());

        // Decrypt password
        String password = encryptionService.decrypt(
                credential.getPassword()
        );

        return new RevealPasswordResponse(password);
    }

}