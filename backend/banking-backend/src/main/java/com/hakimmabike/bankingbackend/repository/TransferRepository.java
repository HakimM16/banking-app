package com.hakimmabike.bankingbackend.repository;

import com.hakimmabike.bankingbackend.entity.Account;
import com.hakimmabike.bankingbackend.entity.Transfer;
import com.hakimmabike.bankingbackend.enums.TransactionStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransferRepository extends JpaRepository<Transfer, Long> {
    // finds transfers by from account
    @Query("SELECT t FROM Transfer t WHERE t.senderAccount = :account")
    List<Transfer> findByFromAccount(Account account);

    // finds transfers by to account
    @Query("SELECT t FROM Transfer t WHERE t.receiverAccount = :account")
    List<Transfer> findByToAccount(Account account);

    // finds transfers by both from and to accounts
    @Query("SELECT t FROM Transfer t WHERE t.senderAccount = :fromAccount AND t.receiverAccount = :toAccount")
    List<Transfer> findByFromAccountAndToAccount(Account fromAccount, Account toAccount);

    // finds transfers by status
    List<Transfer> findByStatus(TransactionStatus status);

    // finds transfers between two dates
    List<Transfer> findByTransferDateBetween(LocalDateTime start, LocalDateTime end);

    // delete all transfers by account (sender or receiver)
    @Modifying
    @Transactional
    void deleteAllBySenderAccount(Account account);

    @Modifying
    @Transactional
    void deleteAllByReceiverAccount(Account account);
}
