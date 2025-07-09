package com.hakimmabike.bankingbackend.controller;

import com.hakimmabike.bankingbackend.dto.JwtResponse;
import com.hakimmabike.bankingbackend.dto.LoginUserRequest;
import com.hakimmabike.bankingbackend.repository.UserRepository;
import com.hakimmabike.bankingbackend.services.JwtService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginUserRequest loginUserRequest) {
        // Authenticate the user using the provided email and password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginUserRequest.getEmail(), // User's email
                        loginUserRequest.getPassword() // User's password
                )
        );
        // If authentication is successful, generate a JWT token
        var token = jwtService.generateToken(loginUserRequest.getEmail());

        // If the user exists and the password matches, return a 200 OK status
        return ResponseEntity.ok(new JwtResponse(token));
    }

    @PostMapping("/validate")
    public Boolean validate(@RequestHeader("Authorization") String authHeader) {
        // Extract the token from the Authorization header by removing the "Bearer " prefix
        var token = authHeader.replace("Bearer ", "");

        // Validate the token using the JwtService and return the result
        return jwtService.validateToken(token);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Void> handleBadCredentialsException() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
