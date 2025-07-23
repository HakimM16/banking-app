package com.hakimmabike.bankingbackend.services;

import com.hakimmabike.bankingbackend.dto.*;
import com.hakimmabike.bankingbackend.entity.User;
import com.hakimmabike.bankingbackend.enums.Role;
import com.hakimmabike.bankingbackend.exception.ExistingObjectException;
import com.hakimmabike.bankingbackend.mappers.UserEntityMapper;
import com.hakimmabike.bankingbackend.entity.UserAddress;
import com.hakimmabike.bankingbackend.enums.UserStatus;
import com.hakimmabike.bankingbackend.repository.UserAddressRepository;
import com.hakimmabike.bankingbackend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserEntityMapper userEntityMapper;

    public UserDto registerUser(RegisterUserRequest request) {
        // Check if the user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ExistingObjectException("User with this email already exists");
        }
        // Convert the incoming request DTO to a User entity
        var user = userEntityMapper.toEntity(request);

        user.setPassword(passwordEncoder.encode(user.getPassword())); // Hash the password before saving
        user.setStatus(UserStatus.ACTIVE);// Set the user status to ACTIVE
        user.setRole(Role.valueOf(request.getRole()));
        System.out.println("User saved: " + user);
        // Save the user to the repository
        userRepository.save(user);

        // Convert the User entity to UserDto and return it
        return userEntityMapper.toDto(user);
    }

    public UserDto updateUser(Long userId, UpdateUserRequest request) {
        // Find the existing user
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Check if the email is already in use by another user
        if (!existingUser.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new ExistingObjectException("Email is already in use by another user");
        }

        // Update the user's details
        var updated = userEntityMapper.update(request, existingUser);

        // Save the updated user
        userRepository.save(existingUser);

        // Convert the updated User entity to UserDto and return it
        return userEntityMapper.toDto(existingUser);
    }

    public void deleteUser(Long userId) {
        // Find the user by ID
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Delete the user
        userRepository.delete(existingUser);
    }

    public void changeUserStatus(Long userId, UpdateStatusRequest status) {
        // Find the existing user
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Update the user's status
        existingUser.setStatus(UserStatus.valueOf(status.getStatus()));

        // Save the updated user
        userRepository.save(existingUser);
    }

    public UserDto getUserById(Long userId) {
        // Find the user by ID
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Convert the User entity to UserDto and return it
        return userEntityMapper.toDto(user);
    }

    // Create user address
    public UserAddressDto createUserAddress(Long userId, CustomiseAddressRequest request) {
        // Find the user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Check if the user already has an address
        if (userAddressRepository.findByUserId(user.getId()).isPresent()) {
            throw new ExistingObjectException("User already has an address");
        }
        System.out.println("postcode: " + request.getPostCode());

        // Convert the request to UserAddress entity
        var newAddress = mapToUserAddress(request);

        System.out.println("postcode: " + newAddress.getPostCode());
        // Set the user for the new address
        newAddress.setUser(user);
        // Save the new address to the repository
        var savedAddress = userAddressRepository.save(newAddress);
        // Convert the saved UserAddress entity to UserAddressDto and return it
        return mapToUserAddressDto(savedAddress);
    }

    // Get User address by Id
    public UserAddressDto getUserAddressById(Long userId) {
        // Find the user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Find the address by ID and user
        UserAddress address = userAddressRepository.findByUserId(user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Address not found for user"));

        // Convert the UserAddress entity to UserAddressDto and return it
        UserAddressDto addressDto = mapToUserAddressDto(address);
        // set country and county
        addressDto.setCountry(address.getCountry());
        addressDto.setCounty(address.getCounty());
        return addressDto;
    }

    // Change User address by Id
    public UserAddressDto updateUserAddress(Long userId, CustomiseAddressRequest request) {
        // Find the user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Find the existing address by ID and user
        UserAddress existingAddress = userAddressRepository.findByUserId(user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Address not found for user"));

        // Update the existing address with new details
        var updated = updateUserAddress(request,existingAddress);

        // Save the updated address to the repository
        var updatedAddress = userAddressRepository.save(existingAddress);

        // Convert the updated UserAddress entity to UserAddressDto and return it
        return mapToUserAddressDto(updatedAddress);
    }

    public boolean emailExists(EmailDto email) {
        return userRepository.existsByEmail(email.getEmail());
    }

    private UserAddress mapToUserAddress(CustomiseAddressRequest request) {
        return UserAddress.builder()
                .street(request.getStreet())
                .city(request.getCity())
                .county(request.getCounty())
                .postCode(request.getPostCode()) // Make sure this matches
                .country(request.getCountry())
                .build();
    }

    // make a method from userAddress to UserAddressDto
    private UserAddressDto mapToUserAddressDto(UserAddress userAddress) {
        return UserAddressDto.builder()
                .id(userAddress.getId())
                .street(userAddress.getStreet())
                .city(userAddress.getCity())
                .postCode(userAddress.getPostCode())
                .userId(userAddress.getId())
                .build();
    }

    // Make a method to update user address
    private UserAddress updateUserAddress(CustomiseAddressRequest request, UserAddress existingAddress) {
        existingAddress.setStreet(request.getStreet());
        existingAddress.setCity(request.getCity());
        existingAddress.setCounty(request.getCounty());
        existingAddress.setPostCode(request.getPostCode());
        existingAddress.setCountry(request.getCountry());
        return existingAddress;
    }

    public boolean userHasAddress(Long id) {
        // Check if the user exists
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found");
        }
        // Check if the user has an address
        return userAddressRepository.findByUserId(id).isPresent();
    }
}
