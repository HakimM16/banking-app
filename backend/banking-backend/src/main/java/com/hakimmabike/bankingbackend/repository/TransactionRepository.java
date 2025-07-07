package com.hakimmabike.bankingbackend.repository;

import com.hakimmabike.bankingbackend.entity.Account;
import com.hakimmabike.bankingbackend.entity.Transaction;
import com.hakimmabike.bankingbackend.entity.TransactionCategory;
import com.hakimmabike.bankingbackend.enums.TransactionStatus;
import com.hakimmabike.bankingbackend.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // Find a transaction by its transaction number
    Optional<Transaction> findByTransactionNumber(String transactionNumber);

    // Find transactions by account
    List<Transaction> findByAccount(Account account);

    // Find transactions by account and transaction type
    List<Transaction> findByAccountAndTransactionType(Account account, TransactionType type);

    // Find transactions by account and status
    List<Transaction> findByAccountAndStatus(Account account, TransactionStatus status);

    // Find transactions between two dates
    List<Transaction> findByTransactionDateBetween(LocalDateTime start, LocalDateTime end);

    // finds transactions by category
    List<Transaction> findByCategory(TransactionCategory category);
}
