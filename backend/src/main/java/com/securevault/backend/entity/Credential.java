package com.securevault.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "credentials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Credential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Logged in User
    @ManyToOne
    @JoinColumn(nullable = false)
    private User user;

    // Gmail
    // Amazon
    // Instagram

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String website;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, length = 1000)
    private String password;

    private String category;

    @Column(length = 3000)
    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}