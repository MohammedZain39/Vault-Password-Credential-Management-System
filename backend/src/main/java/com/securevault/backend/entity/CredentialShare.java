package com.securevault.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "credential_shares")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CredentialShare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Credential being shared
    @ManyToOne
    @JoinColumn(name = "credential_id", nullable = false)
    private Credential credential;

    // User who owns/shares the credential
    @ManyToOne
    @JoinColumn(name = "shared_by", nullable = false)
    private User sharedBy;

    // User receiving the credential
    @ManyToOne
    @JoinColumn(name = "shared_with", nullable = false)
    private User sharedWith;

    // When the share was created
    @Column(nullable = false)
    private LocalDateTime sharedAt;

    // Optional expiry
    private LocalDateTime expiresAt;

    // Whether the share is currently active
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    // Permission given to the recipient
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PermissionLevel permissionLevel = PermissionLevel.VIEW_ONLY;

    @PrePersist
    public void onCreate() {

        sharedAt = LocalDateTime.now();

        if (active == null) {
            active = true;
        }

        if (permissionLevel == null) {
            permissionLevel = PermissionLevel.VIEW_ONLY;
        }
    }
}