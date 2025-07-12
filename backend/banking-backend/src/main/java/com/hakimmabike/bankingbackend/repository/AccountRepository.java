package com.hakimmabike.bankingbackend.repository;

import com.hakimmabike.bankingbackend.entity.Account;
import com.hakimmabike.bankingbackend.entity.User;
import com.hakimmabike.bankingbackend.enums.AccountStatus;
import com.hakimmabike.bankingbackend.enums.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    // Find an account by its account number
    Optional<Account> findByAccountNumber(String accountNumber);

    // Find an account by accountId and userId
    Optional<Account> findByIdAndUserId(Long accountId, Long userId);

    // Find accounts by user
    List<Account> findByUser(User user);

    // Find accounts by user and account type
    List<Account> findByUserAndAccountType(User user, AccountType accountType);

    // check if an account exists by account type
    boolean existsByUserAndAccountType(User user, AccountType accountType);

    // Find accounts by status
    List<Account> findByStatus(AccountStatus status);

    // Checks if an account exists by its account number
    boolean existsByAccountNumber(String accountNumber);

    // Checks if an account exists by user
    boolean existsByUser(User user);

    int countByUserId(Long userId);

    boolean existsByIdAndUserId(Long accountId, Long userId);
}
