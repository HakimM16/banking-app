package com.hakimmabike.bankingbackend.services;

import com.hakimmabike.bankingbackend.dto.*;
import com.hakimmabike.bankingbackend.entity.Account;
import com.hakimmabike.bankingbackend.entity.User;
import com.hakimmabike.bankingbackend.enums.AccountStatus;
import com.hakimmabike.bankingbackend.enums.AccountType;
import com.hakimmabike.bankingbackend.exception.ExistingBalanceException;
import com.hakimmabike.bankingbackend.exception.InvalidObjectException;
import com.hakimmabike.bankingbackend.exception.ObjectExistsException;
import com.hakimmabike.bankingbackend.mappers.AccountMapper;
import com.hakimmabike.bankingbackend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
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
        // Users are allowed to have a maximum of 3 accounts
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        // Check if the user already has an account of the same account type
        if (accountRepository.existsByUser(user) && accountRepository.existsByUserAndAccountType(user, AccountType.valueOf(request.getAccountType()))) {
            throw new ObjectExistsException("User already has an account of that type.");
        }
        var account = new Account();

        // Set the account properties
        account.setAccountType(AccountType.valueOf(request.getAccountType()));
        account.setUser(user);
        account.setAccountNumber(generateAccountNumber());
        account.setStatus(AccountStatus.OPEN);
        account.setBalance(BigDecimal.ZERO);

        accountRepository.save(account);

        // Map the saved account entity to a DTO
        return accountMapper.toDto(account);
    }

    // Update account status
    public AccountDto changeAccountStatus(Long userId, Long accountId, UpdateAccountStatusRequest request) {
        Account account = accountRepository.findByIdAndUserId(accountId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        // Validate the new status
        if (!AccountStatus.isValidStatus(request.getStatus())) {
            throw new InvalidObjectException("Invalid account status provided.");
        }

        // Update the account status
        account.setStatus(AccountStatus.valueOf(request.getStatus()));
        accountRepository.save(account);
        // Map the updated account entity to a DTO
        return accountMapper.toDto(account);
    }

    // close an account
    @Transactional
    public void deleteAccount(Long accountId, DeleteAccountRequest request) {
        // Check if the account exists
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        // Check if account matches with request details
        Boolean isAccountTypeValid = account.getAccountType().equals(AccountType.valueOf(request.getAccountType()));
        if (!account.getAccountNumber().equals(request.getAccountNumber()) && !isAccountTypeValid) {
            throw new InvalidObjectException("Account details do not match. Please check the account number and type.");
        }

        // Check if the account is already closed
        if (account.getStatus() == AccountStatus.CLOSED) {
            deletionProcess(account);
            System.out.println("Account with account number " + account.getAccountNumber() + " is already closed and has been deleted.");
        }

        // Check if the account has a balance
        if (account.getBalance().compareTo(BigDecimal.ZERO) != 0) {
            throw new ExistingBalanceException("Cannot delete account with a non-zero balance. Please withdraw or transfer funds first.");
        }

        // Set the account status to CLOSED
        account.setStatus(AccountStatus.CLOSED);

        deletionProcess(account);

        System.out.println("Account with account number " + account.getAccountNumber() + " has been closed and successfully deleted.");

    }

    private void deletionProcess(Account account) {
        // First delete transfers
        transferRepository.deleteAllBySenderAccount(account);
        transferRepository.deleteAllByReceiverAccount(account);

        // Then delete transactions
        transactionRepository.deleteAllByAccount(account);

        // Then delete categories
        categoryRepository.deleteAllByAccount(account);

        // Update user relationship
        User user = account.getUser();
        user.getAccounts().remove(account);
        userRepository.save(user);

        // Finally delete the account
        accountRepository.delete(account);
    }

    public AccountDto getAccountById(Long accountId, Long userId) {
        var account =  accountRepository.findByIdAndUserId(accountId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));
        return accountMapper.toDto(account);
    }

    public AccountDto updateAccountType(Long userId, Long accountId, UpdateAccountRequest request) {
        Account existingAccount = accountRepository.findByIdAndUserId(accountId, userId)
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

    public BalanceDto getAccountBalance(Long accountId, Long userId) {
        var account = accountRepository.findByIdAndUserId(accountId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        return new BalanceDto(account.getAccountNumber() ,account.getBalance());
    }

    // Get account balance by account number
    public BigDecimal getAccountBalanceByAccountNumber(@NotNull String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with account number: " + accountNumber));
        return account.getBalance();
    }

    public boolean accountExists(String accountNumber) {
        try {
            return accountRepository.existsByAccountNumber(accountNumber);
        } catch (Exception e) {
            return false;
        }
    }

    public TotalBalanceDto getTotalBalance(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        List<Account> accounts = accountRepository.findByUser(user);
        BigDecimal totalBalance = accounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new TotalBalanceDto(totalBalance);
    }

    public ActiveAccountsDto getActiveAccountsCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        List<Account> accounts = accountRepository.findByUser(user);

        int activeAccountsCount = (int) accounts.stream()
                .filter(account -> account.getStatus() == AccountStatus.OPEN)
                .count();

        return new ActiveAccountsDto( activeAccountsCount );
    }
}
