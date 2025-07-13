package com.hakimmabike.bankingbackend.repository;

import com.hakimmabike.bankingbackend.entity.Account;
import com.hakimmabike.bankingbackend.entity.Transaction;
import com.hakimmabike.bankingbackend.entity.TransactionCategory;
import com.hakimmabike.bankingbackend.enums.TransactionStatus;
import com.hakimmabike.bankingbackend.enums.TransactionType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    // Find transa

    // Find transactions by account and transaction type
    List<Transaction> findByAccountAndTransactionType(Account account, TransactionType type);

    // Find transactions by account and status
    List<Transaction> findByAccountAndStatus(Account account, TransactionStatus status);

    // Find transactions between two dates
    List<Transaction> findByTransactionDateBetween(LocalDateTime start, LocalDateTime end);

    // finds transactions by category
    List<Transaction> findByTransactionCategory(TransactionCategory category);

    // Delete transactions by account
    @Modifying
    @Transactional
    void deleteAllByAccount(@Param("account") Account account);

    String account(Account account);

    // check if account has transactions
    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM Transaction t WHERE t.account.id = :accountId")
    boolean existsByAccountByAccountId(Long accountId);
}
