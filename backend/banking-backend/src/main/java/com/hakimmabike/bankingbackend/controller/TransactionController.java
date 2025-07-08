package com.hakimmabike.bankingbackend.controller;

import com.hakimmabike.bankingbackend.dto.*;
import com.hakimmabike.bankingbackend.repository.TransactionRepository;
import com.hakimmabike.bankingbackend.service.TransactionService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;

    // Deposit money into an account
    @PostMapping("/deposit")
    public ResponseEntity<TransactionDto> deposit(@RequestBody DepositRequest request) {
        // make a deposit transaction
        TransactionDto transactionDto = transactionService.deposit(request);
        // Return the transaction details with a 201 Created status
        return ResponseEntity.status(201).body(transactionDto);
    }

    // Withdraw money from an account
    @PostMapping("/withdraw")
    public ResponseEntity<TransactionDto> withdraw(@RequestBody WithdrawRequest request) {
        // make a withdrawal transaction
        TransactionDto transactionDto = transactionService.withdraw(request);
        // Return the transaction details with a 201 Created status
        return ResponseEntity.status(201).body(transactionDto);
    }

    // Transfer money between accounts
    @PostMapping("/transfer")
    public ResponseEntity<TransferDto> transfer(@RequestBody TransferRequest request) {
        // make a transfer transaction
        TransferDto transfer = transactionService.transfer(request);
        // Return the transaction details with a 201 Created status
        return ResponseEntity.status(201).body(transfer);
    }

    // Get all transactions for an account
    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getAllTransactionsByAccountId(
            @PathVariable Long accountId,
            @RequestBody GetTransactionsRequest request
    ) {
        // Fetch all transactions for the specified account ID
        List<TransactionDto> transactions = transactionService.getAllTransactions(accountId, request);

        // If no transactions are found, return a 404 Not Found status
        if (transactions.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        // Return the list of transactions with a 200 OK status
        return ResponseEntity.ok(transactions);
    }
}
