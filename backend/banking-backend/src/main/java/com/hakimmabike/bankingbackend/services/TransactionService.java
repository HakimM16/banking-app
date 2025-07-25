package com.hakimmabike.bankingbackend.services;

import com.hakimmabike.bankingbackend.dto.transaction.*;
import com.hakimmabike.bankingbackend.dto.transactionCategory.CreateTransactionCategoryRequest;
import com.hakimmabike.bankingbackend.dto.transactionCategory.TransactionCategoryDto;
import com.hakimmabike.bankingbackend.entity.Account;
import com.hakimmabike.bankingbackend.entity.Transaction;
import com.hakimmabike.bankingbackend.entity.TransactionCategory;
import com.hakimmabike.bankingbackend.entity.Transfer;
import com.hakimmabike.bankingbackend.enums.AccountStatus;
import com.hakimmabike.bankingbackend.enums.CategoryType;
import com.hakimmabike.bankingbackend.enums.TransactionStatus;
import com.hakimmabike.bankingbackend.enums.TransactionType;
import com.hakimmabike.bankingbackend.exception.InsufficientFundsException;
import com.hakimmabike.bankingbackend.exception.NoAccountException;
import com.hakimmabike.bankingbackend.exception.TransferException;
import com.hakimmabike.bankingbackend.mappers.TransactionMapper;
import com.hakimmabike.bankingbackend.mappers.TransferMapper;
import com.hakimmabike.bankingbackend.repository.AccountRepository;
import com.hakimmabike.bankingbackend.repository.TransactionCategoryRepository;
import com.hakimmabike.bankingbackend.repository.TransactionRepository;
import com.hakimmabike.bankingbackend.repository.TransferRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@AllArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final TransactionCategoryRepository categoryRepository;
    private final TransferRepository transferRepository;
    private final TransactionMapper transactionMapper;
    private final TransferMapper transferMapper;

    public String generateTransactionNumber() {
        long timestamp = System.currentTimeMillis();
        int random = new Random().nextInt(1000); // 3-digit random number
        return String.format("TXN%d%03d", timestamp, random);
    }

    @Transactional
    public TransactionDto deposit(Long userId, DepositRequest request) {
        Account account = accountRepository.findByAccountNumberAndUserId(request.getAccountNumber(), userId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        // Make a deposit transaction
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setTransactionType(String.valueOf(TransactionType.DEPOSIT));

        // Make sure the amount is positive
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InsufficientFundsException("Deposit amount must be positive");
        } else {
            transaction.setAmount(request.getAmount());
        }

        transaction.setDescription(request.getDescription());
        transaction.setAccountNumber(account.getAccountNumber());
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setTransactionNumber(generateTransactionNumber());

        if (request.getCategoryName() != null) {
            transaction.setTransactionCategory(categoryRepository.findByName(request.getCategoryName())
                    .orElseThrow(() -> new EntityNotFoundException("Transaction category not found")));
        }

        // Update the account balance
        BigDecimal newBalance = account.getBalance().add(request.getAmount());
        account.setBalance(newBalance);
        transaction.setBalanceAfterTransaction(newBalance.doubleValue());

        // Save the transaction and account
        accountRepository.save(account);
        transactionRepository.save(transaction);

        // Convert to DTO
        return transactionMapper.toDto(transaction);
    }

    // Create transactionCategory
    public TransactionCategoryDto createTransactionCategory(CreateTransactionCategoryRequest request) {
        // Check if the category already exists
        if (categoryRepository.findByName(request.getName()).isPresent()) {
            throw new EntityNotFoundException("Transaction category already exists");
        }

        // Create a new transaction category
        TransactionCategory category = new TransactionCategory();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setCategoryType(CategoryType.valueOf(request.getCategoryType()));
        category.setSystem(Boolean.valueOf(request.getIsSystem()));

        // Save the category
        TransactionCategory savedCategory = categoryRepository.save(category);

        // Convert to DTO
        return transactionMapper.toCategoryDto(savedCategory);
    }

    // Get Specific Transaction Category
    public TransactionCategoryDto getTransactionCategory(String name) {
        return categoryRepository.findByName(name)
                .map(transactionMapper::toCategoryDto)
                .orElseThrow(() -> new EntityNotFoundException("Transaction category not found"));
    }

    // Get all transaction categories
    public List<TransactionCategoryDto> getAllTransactionCategories() {
        List<TransactionCategory> categories = categoryRepository.findAll();
        return categories.stream()
                .map(transactionMapper::toCategoryDto)
                .toList();
    }

    public TransactionDto withdraw(WithdrawRequest request) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientFundsException("Insufficient funds for withdrawal");
        }

        // Make a withdrawal transaction
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAccountNumber(account.getAccountNumber());
        transaction.setTransactionType(String.valueOf(TransactionType.WITHDRAWAL));
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setTransactionNumber(generateTransactionNumber());

        if (request.getCategoryName() != null) {
            transaction.setTransactionCategory(categoryRepository.findByName(request.getCategoryName())
                    .orElseThrow(() -> new EntityNotFoundException("Transaction category not found")));
        }

        // Update the account balance
        BigDecimal newBalance = account.getBalance().subtract(request.getAmount());
        account.setBalance(newBalance);
        transaction.setBalanceAfterTransaction(newBalance.doubleValue());

        // Save the transaction and account
        accountRepository.save(account);
        transactionRepository.save(transaction);

        // Convert to DTO
        return transactionMapper.toDto(transaction);
    }

    @Transactional
    public TransferDto transfer(TransferRequest request) {
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InsufficientFundsException("Transfer amount must be positive");
        }

        // check if both accounts are the same
        if (request.getFromAccount().equals(request.getToAccount())) {
            throw new TransferException("Cannot transfer to the same account");
        }

        Account fromAccount = accountRepository.findByAccountNumber(request.getFromAccount())
                .orElseThrow(() -> new NoAccountException("Source account not found"));

        Account toAccount = accountRepository.findByAccountNumber(request.getToAccount())
                .orElseThrow(() -> new NoAccountException("Destination account not found"));

        // Create a transfer record
        Transfer transfer = new Transfer();
        transfer.setSenderAccount(fromAccount);
        transfer.setReceiverAccount(toAccount);
        transfer.setAmount(request.getAmount());
        transfer.setDescription(request.getDescription());
        transfer.setStatus(TransactionStatus.COMPLETED);
        transfer.setTransferDate(LocalDateTime.now());

        // Update balances
        BigDecimal fromNewBalance = fromAccount.getBalance().subtract(request.getAmount());
        BigDecimal toNewBalance = toAccount.getBalance().add(request.getAmount());

        fromAccount.setBalance(fromNewBalance);
        toAccount.setBalance(toNewBalance);

        // Save accounts
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        // Save transfer
        Transfer savedTransfer = transferRepository.save(transfer);

        // Create transactions
        createTransferTransactions(savedTransfer, fromNewBalance, toNewBalance);

        // Convert to DTO
        return transferMapper.toDto(savedTransfer, fromAccount.getAccountNumber(), toAccount.getAccountNumber());
    }

    public List<TransactionDto> getAllTransactions(Long userId) {
        // Get all accounts for the user
        List<Account> accounts = accountRepository.findByUserId(userId);

        if (accounts.isEmpty()) {
            throw new EntityNotFoundException("No accounts found for user with ID: " + userId);
        }

        // Get all transactions for the user's accounts
        List<Transaction> transactions = transactionRepository.findByAccountIn(accounts);

        // Check if transactions list is empty
        if (transactions.isEmpty()) {
            throw new EntityNotFoundException("No transactions found for user with ID: " + userId);
        }
        // Map transactions to DTOs
        return transactions.stream()
                .map(transactionMapper::toDto)
                .toList();
    }

    public boolean accountExists(String accountNumber) {
        return accountRepository.existsByAccountNumber(accountNumber);
    }

    public boolean categoryExists(String categoryName) {
        return categoryRepository.existsByName(categoryName);
    }

    public boolean isAccountClosed(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with number: " + accountNumber));
        return account.getStatus() == AccountStatus.CLOSED;
    }

    private void createTransferTransactions(Transfer transfer, BigDecimal fromBalance, BigDecimal toBalance) {
        String transferCode = generateFourCharString();

        Transaction card1 = new Transaction();
        card1.setAccount(transfer.getSenderAccount());
        card1.setAccountNumber(transfer.getSenderAccount().getAccountNumber());
        card1.setTransactionType(String.valueOf(TransactionType.TRANSFER));
        card1.setAmount(transfer.getAmount());
        card1.setDescription("Transfer to " + transfer.getReceiverAccount().getAccountNumber());
        card1.setStatus(TransactionStatus.COMPLETED);
        card1.setCode(transferCode);
        card1.setSender(true);
        card1.setReceiver(false);
        card1.setTransactionDate(LocalDateTime.now());
        card1.setTransactionNumber(generateTransactionNumber());
        card1.setBalanceAfterTransaction(fromBalance.doubleValue());
        card1.setTransfer(transfer);

        Transaction card2 = new Transaction();
        card2.setAccount(transfer.getSenderAccount());
        card2.setAccountNumber(transfer.getReceiverAccount().getAccountNumber());
        card2.setTransactionType(String.valueOf(TransactionType.TRANSFER));
        card2.setAmount(transfer.getAmount());
        card2.setDescription("Transfer from " + transfer.getReceiverAccount().getAccountNumber());
        card2.setStatus(TransactionStatus.COMPLETED);
        card2.setCode(transferCode);
        card2.setReceiver(true);
        card2.setSender(false);
        card2.setTransactionDate(LocalDateTime.now());
        card2.setTransactionNumber(generateTransactionNumber());
        card2.setBalanceAfterTransaction(toBalance.doubleValue());
        card2.setTransfer(transfer);

        transactionRepository.save(card1);
        transactionRepository.save(card2);
    }

    public String generateFourCharString() {
            String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            StringBuilder sb = new StringBuilder(4);
            Random random = new Random();
            for (int i = 0; i < 4; i++) {
                sb.append(chars.charAt(random.nextInt(chars.length())));
            }
            return sb.toString();
        }
}
