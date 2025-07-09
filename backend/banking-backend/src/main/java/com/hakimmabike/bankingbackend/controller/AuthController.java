package com.hakimmabike.bankingbackend.controller;

import com.hakimmabike.bankingbackend.dto.JwtResponse;
import com.hakimmabike.bankingbackend.dto.LoginUserRequest;
import com.hakimmabike.bankingbackend.dto.UserDto;
import com.hakimmabike.bankingbackend.mappers.UserEntityMapper;
import com.hakimmabike.bankingbackend.repository.UserRepository;
import com.hakimmabike.bankingbackend.services.JwtService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserEntityMapper userEntityMapper;

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
        var user = userRepository.findByEmail(loginUserRequest.getEmail()).orElseThrow();

        var token = jwtService.generateToken(user); // Generate JWT token for the authenticated user

        // If the user exists and the password matches, return a 200 OK status
        return ResponseEntity.ok(new JwtResponse(token));
    }

    @PostMapping("/validate")
    public Boolean validate(@RequestHeader("Authorization") String authHeader) {
        System.out.println("Validating token...");
        // Extract the token from the Authorization header by removing the "Bearer " prefix
        var token = authHeader.replace("Bearer ", "");

        // Validate the token using the JwtService and return the result
        return jwtService.validateToken(token);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me() {
        // Get the current authentication from the SecurityContext
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        // Retrieve the email of the authenticated user from the SecurityContext
        var userId = (Long) authentication.getPrincipal();

        var user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if user does not exist
        }

        var userDto = userEntityMapper.toDto(user); // Convert user entity to DTO

        return ResponseEntity.ok(userDto); // Return 200 OK with user details
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Void> handleBadCredentialsException() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
