package com.hakimmabike.bankingbackend.service;

import com.hakimmabike.bankingbackend.dto.UserAddressDto;
import com.hakimmabike.bankingbackend.mappers.UserAddressMapper;
import com.hakimmabike.bankingbackend.dto.UserDto;
import com.hakimmabike.bankingbackend.mappers.UserEntityMapper;
import com.hakimmabike.bankingbackend.entity.User;
import com.hakimmabike.bankingbackend.entity.UserAddress;
import com.hakimmabike.bankingbackend.enums.UserStatus;
import com.hakimmabike.bankingbackend.repository.UserAddressRepository;
import com.hakimmabike.bankingbackend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserEntityMapper userEntityMapper;
    private final UserAddressMapper userAddressMapper;

    public UserDto registerUser(User user) {
        // Check if the user already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("User with this email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Hash the password before saving
        user.setStatus(UserStatus.ACTIVE);// Set the user status to ACTIVE
        System.out.println("User saved: " + user);
        // Save the user to the repository
        userRepository.save(user);

        // Convert the User entity to UserDto and return it
        return userEntityMapper.toDto(user);
    }

    public UserDto updateUser(Long userId, User updatedUser) {
        // Find the existing user
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if the email is already in use by another user
        if (!existingUser.getEmail().equals(updatedUser.getEmail()) &&
                userRepository.existsByEmail(updatedUser.getEmail())) {
            throw new IllegalArgumentException("Email is already in use by another user");
        }

        // Update the user's details
        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        existingUser.setStatus(updatedUser.getStatus());

        // Save the updated user
        userRepository.save(existingUser);

        // Convert the updated User entity to UserDto and return it
        return userEntityMapper.toDto(existingUser);
    }

    public void deleteUser(Long userId) {
        // Find the user by ID
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Delete the user
        userRepository.delete(existingUser);
    }

    public void changeUserStatus(Long userId, UserStatus status) {
        // Find the existing user
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Update the user's status
        existingUser.setStatus(status);

        // Save the updated user
        userRepository.save(existingUser);
    }

    public UserDto getUserById(Long userId) {
        // Find the user by ID
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Convert the User entity to UserDto and return it
        return userEntityMapper.toDto(user);
    }

    public List<UserAddressDto> getUserAddresses(Long userId) {
        // Find the user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Create the user's addresses
        var addresses =  userAddressRepository.findByUserId(user.getId());

        // Convert the list of UserAddress entities to UserAddressDto and return it
        return addresses.stream()
                .map(userAddressMapper::toDto)
                .toList();
    }

    public UserAddressDto addUserAddress(Long userId, UserAddress address) {
        // Find the user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Set the user for the address
        address.setUser(user);

        // Save the address to the repository
        var userAddress =  userAddressRepository.save(address);

        // Convert the UserAddress entity to UserAddressDto and return it
        return userAddressMapper.toDto(userAddress);
    }






}
