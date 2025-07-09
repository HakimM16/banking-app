package com.hakimmabike.bankingbackend.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
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
                .verifyWith(Keys.hmacShaKeyFor(secret.getBytes())) // Use the secret key to verify the token
                .build()
                .parseSignedClaims(token) // Parse the signed claims from the token
                .getPayload(); // Extract the payload (claims)
    }

    public String getEmailFromToken(String token) {
        return getClaims(token).getSubject();
    }

}
