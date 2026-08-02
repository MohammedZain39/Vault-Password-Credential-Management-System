package com.securevault.backend.service;

import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Service
public class EncryptionService {

    // 16 characters = 128-bit AES key
    private static final String SECRET_KEY = "SecureVault12345";

    private SecretKeySpec getKey() {

        return new SecretKeySpec(
                SECRET_KEY.getBytes(),
                "AES"
        );

    }

    // Encrypt
    public String encrypt(String data) {

        try {

            Cipher cipher = Cipher.getInstance("AES");

            cipher.init(
                    Cipher.ENCRYPT_MODE,
                    getKey()
            );

            byte[] encrypted =
                    cipher.doFinal(data.getBytes());

            return Base64.getEncoder()
                    .encodeToString(encrypted);

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

    // Decrypt
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
                    cipher.doFinal(decoded)
            );

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

}