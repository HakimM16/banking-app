package com.hakimmabike.bankingbackend.service;

import com.hakimmabike.bankingbackend.dto.TransactionDto;
import com.hakimmabike.bankingbackend.dto.TransferDto;
import com.hakimmabike.bankingbackend.entity.Account;
import com.hakimmabike.bankingbackend.entity.Transaction;
import com.hakimmabike.bankingbackend.entity.Transfer;
import com.hakimmabike.bankingbackend.enums.TransactionStatus;
import com.hakimmabike.bankingbackend.enums.TransactionType;
import com.hakimmabike.bankingbackend.exception.InsufficientFundsException;
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

@Service
@AllArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final TransactionCategoryRepository categoryRepository;
    private final TransferRepository transferRepository;
    private final TransactionMapper transactionMapper;
    private final TransferMapper transferMapper;

    private String generateTransactionNumber() {
        return "TXN" + System.currentTimeMillis();
    }

    @Transactional
    public TransactionDto deposit(Long accountId, BigDecimal amount, String description, Long categoryId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // Make a deposit transaction
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setTransactionType(TransactionType.DEPOSIT);

        // Make sure the amount is positive
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        } else {
            transaction.setAmount(amount);
        }

        transaction.setDescription(description);
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setTransactionNumber(generateTransactionNumber());

        if (categoryId != null) {
            transaction.setTransactionCategory(categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Transaction category not found")));
        }

        // Update the account balance
        BigDecimal newBalance = account.getBalance().add(amount);
        account.setBalance(newBalance);
        transaction.setBalanceAfterTransaction(newBalance.doubleValue());

        // Save the transaction and account
        accountRepository.save(account);
        transactionRepository.save(transaction);

        // Convert to DTO
        return transactionMapper.toDto(transaction);
    }

    public TransactionDto withdraw(Long accountId, BigDecimal amount, String description, Long categoryId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient funds for withdrawal");
        }

        // Make a withdrawal transaction
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setTransactionType(TransactionType.WITHDRAWAL);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setTransactionNumber(generateTransactionNumber());

        if (categoryId != null) {
            transaction.setTransactionCategory(categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Transaction category not found")));
        }

        // Update the account balance
        BigDecimal newBalance = account.getBalance().subtract(amount);
        account.setBalance(newBalance);
        transaction.setBalanceAfterTransaction(newBalance.doubleValue());

        // Save the transaction and account
        accountRepository.save(account);
        transactionRepository.save(transaction);

        // Convert to DTO
        return transactionMapper.toDto(transaction);
    }

    @Transactional
    public TransferDto transfer(Long fromAccountId, Long toAccountId, BigDecimal amount, String description) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive");
        }

        // check if both accounts are the same
        if (fromAccountId.equals(toAccountId)) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }

        Account fromAccount = accountRepository.findById(fromAccountId)
                .orElseThrow(() -> new EntityNotFoundException("Source account not found"));

        Account toAccount = accountRepository.findById(toAccountId)
                .orElseThrow(() -> new EntityNotFoundException("Destination account not found"));

        // Create a transfer record
        Transfer transfer = new Transfer();
        transfer.setSenderAccount(fromAccount);
        transfer.setReceiverAccount(toAccount);
        transfer.setAmount(amount);
        transfer.setDescription(description);
        transfer.setStatus(TransactionStatus.COMPLETED);
        transfer.setTransferDate(LocalDateTime.now());

        // Update balances
        BigDecimal fromNewBalance = fromAccount.getBalance().subtract(amount);
        BigDecimal toNewBalance = toAccount.getBalance().add(amount);

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

    private void createTransferTransactions(Transfer transfer, BigDecimal fromBalance, BigDecimal toBalance) {
        Transaction card1 = new Transaction();
        card1.setAccount(transfer.getSenderAccount());
        card1.setTransactionType(TransactionType.TRANSFER);
        card1.setAmount(transfer.getAmount());
        card1.setDescription("Transfer to " + transfer.getReceiverAccount().getAccountNumber());
        card1.setStatus(TransactionStatus.COMPLETED);
        card1.setTransactionDate(LocalDateTime.now());
        card1.setTransactionNumber(generateTransactionNumber());
        card1.setBalanceAfterTransaction(fromBalance.doubleValue());
        card1.setTransfer(transfer);

        Transaction card2 = new Transaction();
        card2.setAccount(transfer.getSenderAccount());
        card2.setTransactionType(TransactionType.TRANSFER);
        card2.setAmount(transfer.getAmount());
        card2.setDescription("Transfer from " + transfer.getReceiverAccount().getAccountNumber());
        card2.setStatus(TransactionStatus.COMPLETED);
        card2.setTransactionDate(LocalDateTime.now());
        card2.setTransactionNumber(generateTransactionNumber());
        card2.setBalanceAfterTransaction(toBalance.doubleValue());
        card2.setTransfer(transfer);

        transactionRepository.save(card1);
        transactionRepository.save(card2);
    }
}
