package com.hakimmabike.bankingbackend.service;

import com.hakimmabike.bankingbackend.entity.Account;
import com.hakimmabike.bankingbackend.entity.User;
import com.hakimmabike.bankingbackend.enums.AccountStatus;
import com.hakimmabike.bankingbackend.repository.AccountRepository;
import com.hakimmabike.bankingbackend.repository.TransactionCategoryRepository;
import com.hakimmabike.bankingbackend.repository.TransactionRepository;
import com.hakimmabike.bankingbackend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@AllArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionCategoryRepository categoryRepository;

    public String generateAccountNumber() {
        return String.valueOf((int) (Math.random() * 90000000) + 10000000);
    }

    public Account createAccount(Long userId, Account account) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Check if the user already has an account with the same account number
        if (accountRepository.existsByAccountNumber(account.getAccountNumber())) {
            throw new IllegalArgumentException("An account with this account number already exists");
        }
        // Set the account properties
        account.setUser(user);
        account.setAccountNumber(generateAccountNumber());
        account.setStatus(AccountStatus.OPEN);
        account.setBalance(BigDecimal.ZERO);

        return accountRepository.save(account);
    }

    public void closeAccount(Long accountId) {
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new EntityNotFoundException("Account not found"));

        // check if the account is already closed
        if (account.getStatus() == AccountStatus.CLOSED) {
            throw new IllegalArgumentException("Account is already closed");
        }

        // check if the account has a balance
        if (account.getBalance().compareTo(BigDecimal.ZERO) != 0) {
            throw new IllegalArgumentException("Cannot close account with a non-zero balance. Please withdraw or transfer funds first.");
        }

        // Set the account status to CLOSED
        account.setStatus(AccountStatus.CLOSED);
        accountRepository.save(account);
    }

    public Account getAccountById(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));
    }

    public Account updateAccount(Long accountId, Account updatedAccount) {
        Account existingAccount = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        // Update the account details
        existingAccount.setAccountType(updatedAccount.getAccountType());
        existingAccount.setBalance(updatedAccount.getBalance());
        existingAccount.setStatus(updatedAccount.getStatus());

        return accountRepository.save(existingAccount);
    }

    public List<Account> getUserAccounts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return accountRepository.findByUser(user);
    }

    public BigDecimal getAccountBalance(Long accountId) {
        return getAccountById(accountId).getBalance();
    }

    // Add in deleteAccount method

}
