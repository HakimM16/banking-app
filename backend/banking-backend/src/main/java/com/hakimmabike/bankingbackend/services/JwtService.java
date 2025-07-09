package com.hakimmabike.bankingbackend.services;

import com.hakimmabike.bankingbackend.config.JwtConfig;
import com.hakimmabike.bankingbackend.entity.User;
import com.hakimmabike.bankingbackend.enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@AllArgsConstructor
@Service
public class JwtService {
    // This service will handle JWT creation and validation
    private final JwtConfig jwtConfig;

    public String generateAccessToken(User user) {
       // Token expiration time in seconds (5 mins)
        return generateToken(user, jwtConfig.getAccessTokenExpiration());
    }

    public String generateRefreshToken(User user) {
        // Token expiration time in seconds (7 days)
        return generateToken(user, jwtConfig.getRefreshTokenExpiration());
    }

    private String generateToken(User user, long tokenExpiration) {
        return Jwts.builder()
                .subject(user.getId().toString())
                .issuedAt(new Date())
                .claim("name", user.getFirstName())
                .claim("email", user.getEmail())
                .claim("role", user.getRole())
                .expiration(new Date(System.currentTimeMillis() + 1000 * tokenExpiration)) // Token valid for 24 hours
                .signWith(jwtConfig.getSecretKey()) // Sign the token with the secret key
                .compact();
    }

    public boolean validateToken(String token) {
       try {
           // Parse the JWT token and extract claims
           var claims = getClaims(token);

           // Check if the token's expiration date is after the current date
           return claims.getExpiration().after(new Date());
       }
       catch (JwtException e) {
           // Return false if the token is invalid or an error occurs during parsing
           return false;
       }
   }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(jwtConfig.getSecretKey()) // Use the secret key to verify the token
                .build()
                .parseSignedClaims(token) // Parse the signed claims from the token
                .getPayload(); // Extract the payload (claims)
    }

    public Long getUserIdFromToken(String token) {
        return Long.valueOf(getClaims(token).getSubject());
    }

    public Role getRoleFromToken(String token) {
        return Role.valueOf(getClaims(token).get("role", String.class));
    }

}
