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

    public Jwt generateAccessToken(User user) {
       // Token expiration time in seconds (5 mins)
        return generateToken(user, jwtConfig.getAccessTokenExpiration());
    }

    public Jwt generateRefreshToken(User user) {
        // Token expiration time in seconds (7 days)
        return generateToken(user, jwtConfig.getRefreshTokenExpiration());
    }

    private Jwt generateToken(User user, long tokenExpiration) {
        var claims = Jwts.claims()
                .subject(user.getId().toString())
                .issuedAt(new Date())
                .add("name", user.getFirstName())
                .add("email", user.getEmail())
                .add("role", user.getRole())
                .expiration(new Date(System.currentTimeMillis() + 1000 * tokenExpiration)) // Token valid for 24 hours
                .build();
        return new Jwt(claims, jwtConfig.getSecretKey());
    }

    public Jwt parseToken(String token) {
       try {
           // Parse the JWT token and extract claims
           var claims = getClaims(token);

           // Create a new Jwt object with the claims and secret key
           return new Jwt(claims, jwtConfig.getSecretKey());
       }
       catch (JwtException e) {
           // Return false if the token is invalid or an error occurs during parsing
           return null;
       }
   }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(jwtConfig.getSecretKey()) // Use the secret key to verify the token
                .build()
                .parseSignedClaims(token) // Parse the signed claims from the token
                .getPayload(); // Extract the payload (claims)
    }
}
