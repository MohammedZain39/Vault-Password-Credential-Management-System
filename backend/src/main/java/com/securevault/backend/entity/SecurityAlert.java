package com.securevault.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "security_alert")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SecurityAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String alertType;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(nullable = false)
    private String severity;

    @Column(nullable = false)
    @Builder.Default
    private String status = "UNREAD";

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (status == null) {
            status = "UNREAD";
        }
    }
}