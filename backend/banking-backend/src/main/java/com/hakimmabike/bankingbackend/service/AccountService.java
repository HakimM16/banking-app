package com.hakimmabike.bankingbackend.service;

import com.hakimmabike.bankingbackend.dto.AccountDto;
import com.hakimmabike.bankingbackend.dto.CreateAccountRequest;
import com.hakimmabike.bankingbackend.dto.DeleteAccountRequest;
import com.hakimmabike.bankingbackend.dto.UpdateAccountRequest;
import com.hakimmabike.bankingbackend.entity.Account;
import com.hakimmabike.bankingbackend.entity.User;
import com.hakimmabike.bankingbackend.enums.AccountStatus;
import com.hakimmabike.bankingbackend.exception.AccountStatusException;
import com.hakimmabike.bankingbackend.exception.ExistingBalanceException;
import com.hakimmabike.bankingbackend.exception.InvalidObjectException;
import com.hakimmabike.bankingbackend.exception.ObjectExistsException;
import com.hakimmabike.bankingbackend.mappers.AccountMapper;
import com.hakimmabike.bankingbackend.repository.*;
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
    private final TransferRepository transferRepository;
    private final AccountMapper accountMapper;

    public String generateAccountNumber() {
        return String.valueOf((int) (Math.random() * 90000000) + 10000000);
    }

    public AccountDto createAccount(Long userId, CreateAccountRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        // Check if the user already has an account
        if (accountRepository.existsByUser(user)) {
            throw new ObjectExistsException("User already has an account");
        }
        var account = new Account();

        // Set the account properties
        account.setAccountType(request.getAccountType());
        account.setUser(user);
        account.setAccountNumber(generateAccountNumber());
        account.setStatus(AccountStatus.OPEN);
        account.setBalance(BigDecimal.ZERO);

        accountRepository.save(account);

        // Map the saved account entity to a DTO
        return accountMapper.toDto(account);
    }

    // close an account
    public void closeAccount(Long accountId, DeleteAccountRequest request) {
        // Check if the account exists
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        // Check if account matches with request details
        if (!account.getAccountNumber().equals(request.getAccountNumber()) && !account.getAccountType().equals(request.getAccountType())) {
            throw new InvalidObjectException("Account details do not match. Please check the account number and type.");
        }

        // Check if the account is already closed
        if (account.getStatus() == AccountStatus.CLOSED) {
            throw new AccountStatusException("Account is already closed");
        }

        // Check if the account has a balance
        if (account.getBalance().compareTo(BigDecimal.ZERO) != 0) {
            throw new ExistingBalanceException("Cannot delete account with a non-zero balance. Please withdraw or transfer funds first.");
        }

        // Set the account status to CLOSED
        account.setStatus(AccountStatus.CLOSED);

        // delete associated transactions if needed
        transactionRepository.deleteAllByAccount(account);

        // Delete all sent and received transfers associated with this account
        transferRepository.deleteAllBySenderAccount(account);
        transferRepository.deleteAllByReceiverAccount(account);

        // delete associated transaction categories if needed
        categoryRepository.deleteAllByAccount(account);

        // If you want to remove the account from the user's account list, you can do that as well
        User user = account.getUser();
        user.getAccounts().remove(account);
        userRepository.save(user); // Save the user to update the relationship

        // delete the account
        accountRepository.delete(account);

        System.out.println("Account with account number " + account.getAccountNumber() + " has been successfully deleted.");

    }

    public AccountDto getAccountById(Long accountId) {
        var account =  accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));
        return accountMapper.toDto(account);
    }

    public AccountDto updateAccount(Long accountId, UpdateAccountRequest request) {
        Account existingAccount = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        // Update the account details
        var updated = accountMapper.update(existingAccount, request);

        accountRepository.save(existingAccount);

        // Map the updated account entity to a DTO
        return accountMapper.toDto(existingAccount);
    }

    public List<AccountDto> getUserAccounts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return accountRepository.findByUser(user)
                .stream()
                .map(accountMapper::toDto)
                .toList();
    }

    public BigDecimal getAccountBalance(Long accountId) {
        var account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        return account.getBalance();
    }

}
