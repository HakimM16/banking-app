package com.hakimmabike.bankingbackend.controller;

import com.hakimmabike.bankingbackend.config.JwtConfig;
import com.hakimmabike.bankingbackend.dto.auth.JwtResponse;
import com.hakimmabike.bankingbackend.dto.auth.LoginUserRequest;
import com.hakimmabike.bankingbackend.dto.auth.RegisterUserRequest;
import com.hakimmabike.bankingbackend.repository.UserRepository;
import com.hakimmabike.bankingbackend.services.JwtService;
import com.hakimmabike.bankingbackend.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JwtConfig jwtConfig;
    private final UserService userService;

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @Valid @RequestBody RegisterUserRequest request,
            UriComponentsBuilder uriBuilder) {
        // Check if the user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT) // Return 409 Conflict if user already exists
                    .body("User with this email already exists");
        }

        // Create the user
        var userDto = userService.registerUser(request);

        // Make a new uri for the newly created user
        var uri = uriBuilder.path("/user/{id}")
                .buildAndExpand(userDto.getId())
                .toUri();

        // Return a 201 Created response with the location of the new resource
        return ResponseEntity.created(uri).body(userDto);
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginUserRequest loginUserRequest,
            HttpServletResponse response
    ) {
        // check if the user exists in the database
        if (!userRepository.existsByEmail(loginUserRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Return 404 Unauthorized if user does not exist
        }

        // Authenticate the user using the provided email and password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginUserRequest.getEmail(), // User's email
                        loginUserRequest.getPassword() // User's password
                )
        );


        // If authentication is successful, generate a JWT token
        var user = userRepository.findByEmail(loginUserRequest.getEmail()).orElseThrow();

        var accessToken = jwtService.generateAccessToken(user); // Generate access JWT token for the authenticated user
        var refreshToken = jwtService.generateRefreshToken(user); // Generate refresh token for the authenticated user

        var cookie = new Cookie("refreshToken", refreshToken.toString());
        cookie.setHttpOnly(true); // Set the cookie to be HTTP-only
        cookie.setPath("/auth"); // Set the path for the cookie
        cookie.setMaxAge(jwtConfig.getRefreshTokenExpiration()); // Set the cookie to expire in 7 days
        cookie.setSecure(true);
        response.addCookie(cookie);

        // If the user exists and the password matches, return a 200 OK status
        return ResponseEntity.ok(new JwtResponse(user.getId(), user.getFirstName(), user.getEmail(),accessToken.toString()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Void> handleBadCredentialsException() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
