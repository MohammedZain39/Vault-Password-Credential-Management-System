package com.securevault.backend.service;

import com.securevault.backend.dto.PasswordHealthResponse;
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
public class PasswordHealthServiceImpl
        implements PasswordHealthService {

    private final CredentialRepository credentialRepository;
    private final UserRepository userRepository;

    @Override
    public PasswordHealthResponse getMyPasswordHealth() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<Credential> credentials =
                credentialRepository.findByUser(user);

        long total = credentials.size();

        long strong = 0;
        long medium = 0;
        long weak = 0;

        for (Credential credential : credentials) {

            String password = credential.getPassword();

            String strength =
                    calculateStrength(password);

            switch (strength) {

                case "STRONG":
                    strong++;
                    break;

                case "MEDIUM":
                    medium++;
                    break;

                default:
                    weak++;
                    break;
            }
        }

        int healthScore = calculateHealthScore(
                total,
                strong,
                medium,
                weak
        );

        return PasswordHealthResponse.builder()
                .totalCredentials(total)
                .strongPasswords(strong)
                .mediumPasswords(medium)
                .weakPasswords(weak)
                .healthScore(healthScore)
                .build();
    }


    private String calculateStrength(String password) {

        if (password == null || password.isEmpty()) {
            return "WEAK";
        }

        int score = 0;

        // Length
        if (password.length() >= 8) {
            score++;
        }

        if (password.length() >= 12) {
            score++;
        }

        // Uppercase
        if (password.matches(".*[A-Z].*")) {
            score++;
        }

        // Lowercase
        if (password.matches(".*[a-z].*")) {
            score++;
        }

        // Number
        if (password.matches(".*[0-9].*")) {
            score++;
        }

        // Special character
        if (password.matches(".*[^a-zA-Z0-9].*")) {
            score++;
        }


        if (score >= 5) {
            return "STRONG";
        }

        if (score >= 3) {
            return "MEDIUM";
        }

        return "WEAK";
    }


    private int calculateHealthScore(
            long total,
            long strong,
            long medium,
            long weak) {

        if (total == 0) {
            return 0;
        }

        /*
         * Strong = 100 points
         * Medium = 60 points
         * Weak = 20 points
         */

        double score =
                (
                        (strong * 100.0)
                                +
                                (medium * 60.0)
                                +
                                (weak * 20.0)
                )
                        / total;

        return (int) Math.round(score);
    }
}