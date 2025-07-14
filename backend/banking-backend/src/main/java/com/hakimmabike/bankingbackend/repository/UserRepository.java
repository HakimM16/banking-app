package com.hakimmabike.bankingbackend.repository;

import com.hakimmabike.bankingbackend.entity.User;
import com.hakimmabike.bankingbackend.enums.UserStatus;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Check if a user exists by email
    boolean existsByEmail(String email);

    // Find a user by email
    Optional<User> findByEmail(String email);

    // Find users by their status
    List<User> findByStatus(UserStatus status);
}
