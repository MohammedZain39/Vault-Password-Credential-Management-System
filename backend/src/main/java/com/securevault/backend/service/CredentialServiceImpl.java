package com.securevault.backend.service;

import com.securevault.backend.dto.AuthResponse;
import com.securevault.backend.dto.CreateCredentialRequest;
import com.securevault.backend.dto.CredentialResponse;
import com.securevault.backend.dto.RevealPasswordRequest;
import com.securevault.backend.dto.RevealPasswordResponse;
import com.securevault.backend.dto.SharedCredentialResponse;
import com.securevault.backend.entity.Credential;
import com.securevault.backend.entity.CredentialShare;
import com.securevault.backend.entity.PermissionLevel;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.CredentialRepository;
import com.securevault.backend.repository.CredentialShareRepository;
import com.securevault.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CredentialServiceImpl implements CredentialService {

    private final CredentialRepository credentialRepository;
    private final UserRepository userRepository;
    private final CredentialShareRepository credentialShareRepository;
    private final EncryptionService encryptionService;
    private final VaultService vaultService;


    // ==========================
    // GET LOGGED-IN USER
    // ==========================

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
    public AuthResponse addCredential(
            CreateCredentialRequest request
    ) {

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
    // GET ALL CREDENTIALS
    // ==========================

    @Override
    public List<CredentialResponse> getAllCredentials() {

        User user = getLoggedInUser();

        return credentialRepository.findByUser(user)
                .stream()
                .map(c ->
                        CredentialResponse.builder()
                                .id(c.getId())
                                .title(c.getTitle())
                                .website(c.getWebsite())
                                .username(c.getUsername())

                                // Hide password in list
                                .password("********")

                                .category(c.getCategory())
                                .notes(c.getNotes())
                                .build()
                )
                .toList();
    }


    // ==========================
    // GET ONE CREDENTIAL
    // ==========================

    @Override
    public CredentialResponse getCredential(Long id) {

        User user = getLoggedInUser();

        Credential credential =
                credentialRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential not found"
                                ));

        // Only owner can access normal credential endpoint
        if (!credential.getUser().getId().equals(user.getId())) {

            throw new RuntimeException(
                    "Access denied"
            );
        }

        return CredentialResponse.builder()
                .id(credential.getId())
                .title(credential.getTitle())
                .website(credential.getWebsite())
                .username(credential.getUsername())

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
    // UPDATE CREDENTIAL
    // ==========================

    @Override
    public AuthResponse updateCredential(
            Long id,
            CreateCredentialRequest request
    ) {

        User user = getLoggedInUser();

        Credential credential =
                credentialRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential not found"
                                ));


        // ==========================================
        // OWNER
        // ==========================================

        if (credential.getUser().getId().equals(user.getId())) {

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


        // ==========================================
        // SHARED USER
        // ==========================================

        CredentialShare share =
                credentialShareRepository
                        .findByCredentialIdAndSharedWith(
                                id,
                                user
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Access denied"
                                ));


        // ==========================================
        // CHECK ACTIVE
        // ==========================================

        if (!Boolean.TRUE.equals(share.getActive())) {

            throw new RuntimeException(
                    "This credential share is no longer active."
            );
        }


        // ==========================================
        // CHECK EXPIRY
        // ==========================================

        if (share.getExpiresAt() != null &&
                share.getExpiresAt()
                        .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "This credential share has expired."
            );
        }


        // ==========================================
        // VIEW ONLY
        // ==========================================

        if (share.getPermissionLevel()
                == PermissionLevel.VIEW_ONLY) {

            throw new RuntimeException(
                    "You only have view-only access to this credential."
            );
        }


        // ==========================================
        // EDIT ACCESS
        // ==========================================

        if (share.getPermissionLevel()
                == PermissionLevel.EDIT_ACCESS) {

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


        throw new RuntimeException(
                "Invalid permission."
        );
    }


    // ==========================
    // DELETE CREDENTIAL
    // ==========================

    @Override
    public AuthResponse deleteCredential(Long id) {

        User user = getLoggedInUser();

        Credential credential =
                credentialRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential not found"
                                ));

        // Only owner can delete
        if (!credential.getUser().getId().equals(user.getId())) {

            throw new RuntimeException(
                    "Access denied"
            );
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

        Credential credential =
                credentialRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential not found"
                                ));

        // Only owner can currently reveal password
        if (!credential.getUser().getId().equals(user.getId())) {

            throw new RuntimeException(
                    "Access denied"
            );
        }

        // Verify Master PIN
        vaultService.validatePin(
                request.getPin()
        );

        // Decrypt password
        String password =
                encryptionService.decrypt(
                        credential.getPassword()
                );

        return new RevealPasswordResponse(
                password
        );
    }


    // ==========================
    // SHARE CREDENTIAL
    // ==========================

    @Override
    public AuthResponse shareCredential(
            Long credentialId,
            String recipientEmail,
            LocalDateTime expiresAt,
            PermissionLevel permissionLevel
    ) {

        User sender = getLoggedInUser();

        Credential credential =
                credentialRepository.findById(credentialId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential not found"
                                ));


        // Only owner can share
        if (!credential.getUser().getId().equals(sender.getId())) {

            throw new RuntimeException(
                    "Access denied"
            );
        }


        // Find recipient
        User recipient =
                userRepository.findByEmail(recipientEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User with this email is not registered"
                                ));


        // Prevent self-sharing
        if (sender.getId().equals(recipient.getId())) {

            throw new RuntimeException(
                    "You cannot share a credential with yourself"
            );
        }


        // Check duplicate share
        if (credentialShareRepository
                .existsByCredentialIdAndSharedWith(
                        credentialId,
                        recipient
                )) {

            throw new RuntimeException(
                    "Credential is already shared with this user"
            );
        }


        // Validate expiry
        if (expiresAt != null &&
                expiresAt.isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "Expiry date must be in the future"
            );
        }


        // Default permission
        if (permissionLevel == null) {

            permissionLevel =
                    PermissionLevel.VIEW_ONLY;
        }


        CredentialShare share =
                CredentialShare.builder()
                        .credential(credential)
                        .sharedBy(sender)
                        .sharedWith(recipient)
                        .expiresAt(expiresAt)
                        .active(true)
                        .permissionLevel(permissionLevel)
                        .build();

        credentialShareRepository.save(share);


        return new AuthResponse(
                "Credential shared successfully with "
                        + recipient.getEmail()
                        + " with "
                        + permissionLevel
                        + " permission."
        );
    }


    // ==========================
    // GET SHARED CREDENTIALS
    // ==========================

    @Override
    public List<SharedCredentialResponse> getSharedCredentials() {

        User user = getLoggedInUser();

        return credentialShareRepository
                .findBySharedWith(user)
                .stream()

                // Ignore inactive shares
                .filter(share ->
                        Boolean.TRUE.equals(
                                share.getActive()
                        )
                )

                // Ignore expired shares
                .filter(share ->
                        share.getExpiresAt() == null
                                ||
                                share.getExpiresAt()
                                        .isAfter(
                                                LocalDateTime.now()
                                        )
                )

                .map(share -> {

                    Credential credential =
                            share.getCredential();

                    return SharedCredentialResponse.builder()

                            .shareId(
                                    share.getId()
                            )

                            .credentialId(
                                    credential.getId()
                            )

                            .title(
                                    credential.getTitle()
                            )

                            .website(
                                    credential.getWebsite()
                            )

                            .username(
                                    credential.getUsername()
                            )

                            .password(
                                    encryptionService.decrypt(
                                            credential.getPassword()
                                    )
                            )

                            .category(
                                    credential.getCategory()
                            )

                            .notes(
                                    credential.getNotes()
                            )

                            .sharedBy(
                                    share.getSharedBy()
                                            .getEmail()
                            )

                            .sharedAt(
                                    share.getSharedAt()
                            )

                            .expiresAt(
                                    share.getExpiresAt()
                            )

                            .permissionLevel(
                                    share.getPermissionLevel()
                            )

                            .build();
                })

                .toList();
    }
}