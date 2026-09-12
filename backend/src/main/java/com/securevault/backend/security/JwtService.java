package com.securevault.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    private final String secretKey;
    private final long jwtExpiration;

    public JwtService(
            @Value("${jwt.secret}") String secretKey,
            @Value("${jwt.expiration:86400000}") long jwtExpiration
    ) {

        if (secretKey == null || secretKey.length() < 32) {
            throw new IllegalArgumentException(
                    "JWT_SECRET must contain at least 32 characters."
            );
        }

        this.secretKey = secretKey;
        this.jwtExpiration = jwtExpiration;
    }

    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8)
        );
    }

    // ==========================================
    // GENERATE TOKEN
    // ==========================================

    public String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + jwtExpiration
                        )
                )
                .signWith(getSigningKey())
                .compact();
    }

    // ==========================================
    // EXTRACT USERNAME
    // ==========================================

    public String extractUsername(String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }

    // ==========================================
    // EXTRACT EXPIRATION
    // ==========================================

    public Date extractExpiration(String token) {

        return extractClaim(
                token,
                Claims::getExpiration
        );
    }

    // ==========================================
    // GENERIC CLAIM EXTRACTOR
    // ==========================================

    public <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver
    ) {

        Claims claims =
                extractAllClaims(token);

        return claimsResolver.apply(claims);
    }

    // ==========================================
    // PARSE JWT
    // ==========================================

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ==========================================
    // TOKEN EXPIRATION
    // ==========================================

    private boolean isTokenExpired(String token) {

        return extractExpiration(token)
                .before(new Date());
    }

    // ==========================================
    // VALIDATE TOKEN
    // ==========================================

    public boolean isTokenValid(
            String token,
            String email
    ) {

        final String username =
                extractUsername(token);

        return username.equals(email)
                && !isTokenExpired(token);
    }
}