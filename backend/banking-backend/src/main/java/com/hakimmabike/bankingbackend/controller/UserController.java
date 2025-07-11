package com.hakimmabike.bankingbackend.controller;

import com.hakimmabike.bankingbackend.dto.*;
import com.hakimmabike.bankingbackend.enums.UserStatus;
import com.hakimmabike.bankingbackend.repository.UserRepository;
import com.hakimmabike.bankingbackend.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@AllArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    // Update an existing user
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        // check if the user exists
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // check if email or phone number are in correct format
        if (!request.getEmail().matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$") ||
                !request.getPhoneNumber().matches("^\\+?[0-9]{10,15}$")) {
            return ResponseEntity.badRequest().build();
        }

        // check if status is valid
        if (!UserStatus.isValidStatus(request.getStatus())) {
            System.out.println("Invalid status: " + request.getStatus());
            return ResponseEntity.badRequest().build();
        }

        // Update the user
        var updatedUser = userService.updateUser(id, request);
        return updatedUser != null
                ? ResponseEntity.ok(updatedUser)
                : ResponseEntity.notFound().build();
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        // check if the user exists
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        var userDto = userService.getUserById(id);
        return userDto != null
                ? ResponseEntity.ok(userDto)
                : ResponseEntity.notFound().build();
    }

    // Delete a user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        // Check if the user exists
        if (!userRepository.existsById(id))  {
            return ResponseEntity.notFound().build();
        }
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Change users' status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> changeUserStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest status) {
        // Check if the user exists
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // check if status is valid
        if (!UserStatus.isValidStatus(status.getStatus()) && !status.getStatus().equals("")) {
            return ResponseEntity.badRequest().body("Invalid status provided");
        }

        // check if request body is empty
        if (status.getStatus().equals("")) {
            return ResponseEntity.badRequest().body("Status cannot be blank");
        }

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
