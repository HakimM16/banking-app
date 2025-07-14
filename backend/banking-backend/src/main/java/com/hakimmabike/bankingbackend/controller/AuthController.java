package com.hakimmabike.bankingbackend.controller;

import com.hakimmabike.bankingbackend.config.JwtConfig;
import com.hakimmabike.bankingbackend.dto.JwtResponse;
import com.hakimmabike.bankingbackend.dto.LoginUserRequest;
import com.hakimmabike.bankingbackend.dto.RegisterUserRequest;
import com.hakimmabike.bankingbackend.dto.UserDto;
import com.hakimmabike.bankingbackend.mappers.UserEntityMapper;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JwtConfig jwtConfig;
    private final UserEntityMapper userEntityMapper;
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
        return ResponseEntity.ok(new JwtResponse(accessToken.toString()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @CookieValue(value = "refreshToken") String refreshToken
    ) {
        var jwt = jwtService.parseToken(refreshToken);
        if (jwt == null || jwt.isExpired()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Return 401 Unauthorized if the token is invalid
        }

        var user = userRepository.findById(jwt.getUserId()).orElseThrow(); // Retrieve the user from the database using the user ID from the JWT
        var accessToken = jwtService.generateAccessToken(user); // Generate a new access token for the user

        // Return the new access token in the response
        return ResponseEntity.ok(new JwtResponse(accessToken.toString()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
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
