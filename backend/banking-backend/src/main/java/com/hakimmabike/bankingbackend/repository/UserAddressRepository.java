package com.hakimmabike.bankingbackend.repository;

import com.hakimmabike.bankingbackend.entity.User;
import com.hakimmabike.bankingbackend.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
    // Find addresses by user ID
    List<UserAddress> findByUserId(Long userId);

    // Find addresses by user and country
    List<UserAddress> findByUserAndCountry(User user, String country);
}
