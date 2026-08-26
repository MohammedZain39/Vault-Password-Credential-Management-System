package com.securevault.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "suspicious_activity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuspiciousActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String activityType;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDateTime detectedAt;

    @Column(nullable = false)
    @Builder.Default
    private String status = "FLAGGED";

    @PrePersist
    public void onCreate() {

        if (detectedAt == null) {
            detectedAt = LocalDateTime.now();
        }

        if (status == null) {
            status = "FLAGGED";
        }
    }
}