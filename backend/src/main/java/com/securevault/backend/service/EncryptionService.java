package com.securevault.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class EncryptionService {

    private final String secretKey;

    public EncryptionService(
            @Value("${app.encryption.secret}") String secretKey
    ) {
        this.secretKey = secretKey;

        if (secretKey == null || secretKey.length() != 16) {
            throw new IllegalArgumentException(
                    "ENCRYPTION_KEY must be exactly 16 characters for the current AES implementation."
            );
        }
    }

    private SecretKeySpec getKey() {

        return new SecretKeySpec(
                secretKey.getBytes(StandardCharsets.UTF_8),
                "AES"
        );
    }

    // ==========================================
    // ENCRYPT
    // ==========================================

    public String encrypt(String data) {

        try {

            Cipher cipher = Cipher.getInstance("AES");

            cipher.init(
                    Cipher.ENCRYPT_MODE,
                    getKey()
            );

            byte[] encrypted =
                    cipher.doFinal(
                            data.getBytes(StandardCharsets.UTF_8)
                    );

            return Base64.getEncoder()
                    .encodeToString(encrypted);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Encryption failed.",
                    e
            );
        }
    }

    // ==========================================
    // DECRYPT
    // ==========================================

    public String decrypt(String encryptedData) {

        try {

            Cipher cipher = Cipher.getInstance("AES");

            cipher.init(
                    Cipher.DECRYPT_MODE,
                    getKey()
            );

            byte[] decoded =
                    Base64.getDecoder()
                            .decode(encryptedData);

            return new String(
                    cipher.doFinal(decoded),
                    StandardCharsets.UTF_8
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Decryption failed.",
                    e
            );
        }
    }
}