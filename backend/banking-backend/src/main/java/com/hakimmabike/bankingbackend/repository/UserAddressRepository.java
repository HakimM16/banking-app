package com.hakimmabike.bankingbackend.repository;

import com.hakimmabike.bankingbackend.entity.User;
import com.hakimmabike.bankingbackend.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
    // Find address by user ID
    @Query("SELECT ua FROM UserAddress ua WHERE ua.user.id = :userId")
    Optional<UserAddress> findByUserId(Long userId);

    // Find address by user and country
    UserAddress findByUserAndCountry(User user, String country);
}
