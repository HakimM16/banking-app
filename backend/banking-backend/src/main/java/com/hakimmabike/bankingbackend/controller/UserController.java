package com.hakimmabike.bankingbackend.controller;

import com.hakimmabike.bankingbackend.dto.*;
import com.hakimmabike.bankingbackend.repository.UserRepository;
import com.hakimmabike.bankingbackend.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@AllArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    // Update an existing user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
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

        // Update the user
        var updatedUser = userService.updateUser(id, request);
        return updatedUser != null
                ? ResponseEntity.ok(updatedUser)
                : ResponseEntity.notFound().build();
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        // check if the user exists
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        var userDto = userService.getUserById(id);
        return userDto != null
                ? ResponseEntity.ok(userDto)
                : ResponseEntity.notFound().build();
    }

    // Create a new user address
    @PostMapping("/{id}/create_address")
    public ResponseEntity<?> createUserAddress(
            @PathVariable Long id,
            @Valid @RequestBody CustomiseAddressRequest request,
            UriComponentsBuilder uriBuilder) {
        // Check if the user exists
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // check if body is empty
        if (request.getStreet().isEmpty() && request.getCity().isEmpty() &&
                request.getPostCode().isEmpty() && request.getCountry().isEmpty() &&
                request.getCounty().isEmpty()) {
            return ResponseEntity.badRequest().body("Address cannot be empty");
        }

        // check if field is empty
        if (request.getStreet().isEmpty() || request.getCity().isEmpty() ||
            request.getPostCode().isEmpty() || request.getCountry().isEmpty() ||
            request.getCounty().isEmpty()) {
            return ResponseEntity.badRequest().body("Address fields cannot be empty");
        }

        // check if postcode is in correct format
        if (!request.getPostCode().matches("^[A-Z0-9]{2,10}$")) {
            return ResponseEntity.badRequest().body("Invalid postcode format");
        }


        var userAddressDto = userService.createUserAddress(id, request);
        var uri = uriBuilder.path("/user/{id}/address")
                .buildAndExpand(userAddressDto.getId())
                .toUri();
        return ResponseEntity.created(uri).body(userAddressDto);
    }

    // Update user address
    @PutMapping("/{id}/update_address")
    public ResponseEntity<?> updateUserAddress(
            @PathVariable Long id,
            @Valid @RequestBody CustomiseAddressRequest request) {
        // Check if the user exists
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // check if body is empty
        if (request.getStreet().isEmpty() && request.getCity().isEmpty() &&
                request.getPostCode().isEmpty() && request.getCountry().isEmpty() &&
                request.getCounty().isEmpty()) {
            return ResponseEntity.badRequest().body("Address cannot be empty");
        }

        // check if field is empty
        if (request.getStreet().isEmpty() || request.getCity().isEmpty() ||
                request.getPostCode().isEmpty() || request.getCountry().isEmpty() ||
                request.getCounty().isEmpty()) {
            return ResponseEntity.badRequest().body("Address fields cannot be empty");
        }

        // check if postcode is in correct format
        if (!request.getPostCode().matches("^[A-Z0-9]{2,10}$")) {
            return ResponseEntity.badRequest().body("Invalid postcode format");
        }

        // check if user has an address
        if (!userService.userHasAddress(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User does not have an address");
        }

        var updatedAddress = userService.updateUserAddress(id, request);
        return updatedAddress != null
                ? ResponseEntity.ok(updatedAddress)
                : ResponseEntity.notFound().build();
    }

    // Get user addresses
    @GetMapping("/{id}/address")
    public ResponseEntity<?> getUserAddress(@PathVariable Long id) {
        // Check if the user exists
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Check if the user has an address
        if (!userService.userHasAddress(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User does not have an address");
        }

        var userAddress = userService.getUserAddressById(id);

        return userAddress != null
                ? ResponseEntity.ok(userAddress)
                : ResponseEntity.notFound().build();
    }

    // Check if email exists
    @GetMapping("/email_exists/{email}")
    public Boolean emailExists(@PathVariable String email) {
        // Check if the email is in correct format

        boolean exists = userService.emailExists(new EmailDto(email));
        return exists;
    }

}
