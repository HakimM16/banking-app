package com.hakimmabike.bankingbackend.services;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {
    // This service will handle JWT creation and validation
    @Value("${spring.jwt.secret}")
    private String secret;
    public String generateToken(String email) {
        final long tokenExpiration = 86400; // Token expiration time in seconds (24 hours)

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * tokenExpiration)) // Token valid for 24 hours
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .compact();
    }

}
