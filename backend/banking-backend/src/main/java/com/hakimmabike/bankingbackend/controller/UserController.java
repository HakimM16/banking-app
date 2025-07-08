package com.hakimmabike.bankingbackend.controller;

import com.hakimmabike.bankingbackend.dto.CustomiseAddressRequest;
import com.hakimmabike.bankingbackend.dto.RegisterUserRequest;
import com.hakimmabike.bankingbackend.dto.UpdateUserRequest;
import com.hakimmabike.bankingbackend.dto.UserDto;
import com.hakimmabike.bankingbackend.enums.UserStatus;
import com.hakimmabike.bankingbackend.repository.UserRepository;
import com.hakimmabike.bankingbackend.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    // Register a new user
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> registerUser(
            @Valid @RequestBody RegisterUserRequest request,
            UriComponentsBuilder uriBuilder) {
        // Create the user
        var userDto = userService.registerUser(request);

        // Make a new uri for the newly created user
        var uri = uriBuilder.path("/users/{id}")
                .buildAndExpand(userDto.getId())
                .toUri();

        // Check if the user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("User with this email already exists");
        }

        // Return a 201 Created response with the location of the new resource
        return ResponseEntity.created(uri).body(userDto);
    }

    // Update an existing user
    @PutMapping("/{id}")
    public UserDto updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        return userService.updateUser(id, request);
    }

    // Get user by ID
    @GetMapping("/{id}")
    public UserDto getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // Delete a user
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    // Change users' status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> changeUserStatus(
            @PathVariable Long id,
            @RequestParam UserStatus status) {
        try {
            userService.changeUserStatus(id, status);
            return ResponseEntity.ok("User status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Create a new user address
    @PostMapping("/{id}/address")
    public ResponseEntity<?> createUserAddress(
            @PathVariable Long id,
            @Valid @RequestBody CustomiseAddressRequest request,
            UriComponentsBuilder uriBuilder) {
        var userAddressDto = userService.createUserAddress(id, request);
        var uri = uriBuilder.path("/users/{id}/address")
                .buildAndExpand(userAddressDto.getId())
                .toUri();
        return ResponseEntity.created(uri).body(userAddressDto);
    }

    // Update user address
    @PutMapping("/{id}/address")
    public ResponseEntity<?> updateUserAddress(
            @PathVariable Long id,
            @Valid @RequestBody CustomiseAddressRequest request) {
        var updatedAddress = userService.updateUserAddress(id, request);
        return updatedAddress != null
                ? ResponseEntity.ok(updatedAddress)
                : ResponseEntity.notFound().build();
    }

    // Get user addresses
    @GetMapping("/{id}/address")
    public ResponseEntity<?> getUserAddress(@PathVariable Long id) {
        var userAddress = userService.getUserAddressById(id);
        return userAddress != null
                ? ResponseEntity.ok(userAddress)
                : ResponseEntity.notFound().build();
    }


}
