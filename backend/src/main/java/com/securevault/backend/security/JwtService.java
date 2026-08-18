package com.securevault.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    // Keep this secret private.
    // Must be at least 32 bytes for HS256.
    private static final String SECRET_KEY =
            "6N5Qk2v8x/A?D(G+KbPeShVmYq3t6w9z$C&F-JaNdRgUkXp2";

    // 24 hours
    private static final long JWT_EXPIRATION =
            1000L * 60 * 60 * 24;

    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes(StandardCharsets.UTF_8)
        );
    }

    // ============================
    // Generate Token
    // ============================

    public String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + JWT_EXPIRATION
                        )
                )
                .signWith(getSigningKey())
                .compact();
    }

    // ============================
    // Extract Email
    // ============================

    public String extractUsername(String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }

    // ============================
    // Extract Expiration
    // ============================

    public Date extractExpiration(String token) {

        return extractClaim(
                token,
                Claims::getExpiration
        );
    }

    // ============================
    // Generic Claim Extractor
    // ============================

    public <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver
    ) {

        Claims claims = extractAllClaims(token);

        return claimsResolver.apply(claims);
    }

    // ============================
    // Parse JWT
    // ============================

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ============================
    // Token Expired?
    // ============================

    private boolean isTokenExpired(String token) {

        return extractExpiration(token)
                .before(new Date());
    }

    // ============================
    // Validate Token
    // ============================

    public boolean isTokenValid(
            String token,
            String email
    ) {

        final String username = extractUsername(token);

        return username.equals(email)
                && !isTokenExpired(token);
    }
}