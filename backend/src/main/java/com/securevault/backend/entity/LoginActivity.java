package com.securevault.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "login_activity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private Boolean successful;

    @Column(nullable = false)
    private LocalDateTime loginTime;

    private String ipAddress;

    @PrePersist
    public void onCreate() {
        loginTime = LocalDateTime.now();
    }
}