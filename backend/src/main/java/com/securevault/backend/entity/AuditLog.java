package com.securevault.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    public void onCreate() {

        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}