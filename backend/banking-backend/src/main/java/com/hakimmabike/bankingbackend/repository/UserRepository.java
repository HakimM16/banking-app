package com.hakimmabike.bankingbackend.repository;

import com.hakimmabike.bankingbackend.entity.User;
import com.hakimmabike.bankingbackend.enums.UserStatus;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Check if a user exists by email
    boolean existsByEmail(String email);

    // Find a user by email
    User findByEmail(String email);

    // Find users by their status
    List<User> findByStatus(UserStatus status);
}
