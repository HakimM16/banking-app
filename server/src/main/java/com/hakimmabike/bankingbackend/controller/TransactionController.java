package com.hakimmabike.bankingbackend.controller;

import com.hakimmabike.bankingbackend.dto.transaction.*;
import com.hakimmabike.bankingbackend.services.AccountService;
import com.hakimmabike.bankingbackend.services.TransactionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "https://banking-app-xi-wheat.vercel.app"})
@RestController
@AllArgsConstructor
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;
    private final AccountService accountService;

    // Deposit money into an account
    @PostMapping("/{userId}/deposit")//
    public ResponseEntity<?> deposit(
            @PathVariable Long userId,
            @RequestBody DepositRequest request
    ) {
        // check if account number exists
        if (!transactionService.accountExists(request.getAccountNumber())) {
            return ResponseEntity.badRequest().body("Accout doesn't exist"); // Return 400 Bad Request if account number does not exist
        }

        // check if amount is negative or zero
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body("Amount must be greater than zero"); // Return 400 Bad Request if amount is negative or zero
        }

        // check if fields are empty
        if (request.getAccountNumber() == null || request.getAccountNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("Account number can't be empty"); // Return 400 Bad Request if account number is empty
        }
        if (request.getDescription() == null || request.getDescription().isEmpty()) {
            return ResponseEntity.badRequest().body("Description can't be empty"); // Return 400 Bad Request if description is empty
        }
        if (request.getCategoryName() == null || request.getCategoryName().isEmpty()) {
            return ResponseEntity.badRequest().body("Category name can't be empty"); // Return 400 Bad Request if category name is empty
        }
        if (request.getAmount() == null) {
            return ResponseEntity.badRequest().body("Amount can't be empty"); // Return 400 Bad Request if amount is empty
        }

        // check if category exists
        if (!transactionService.categoryExists(request.getCategoryName())) {
            return ResponseEntity.badRequest().body("Category doesn't exist"); // Return 400 Bad Request if category does not exist
        }

        // check if account is closed
        if (transactionService.isAccountClosed(request.getAccountNumber())) {
            // return 409 Conflict if the account is closed
            return ResponseEntity.status(HttpStatusCode.valueOf(409)).body("Account is closed, can't make a deposit");
        }
        // make a deposit transaction
        TransactionDto transactionDto = transactionService.deposit(userId,request);
        // Return the transaction details with a 201 Created status
        return ResponseEntity.status(201).body(transactionDto);
    }

    // Withdraw money from an account
    @PostMapping("/{userId}/withdraw")//
    public ResponseEntity<?> withdraw(@RequestBody WithdrawRequest request) {
        // Check if account number exists
        if (!accountService.accountExists(request.getAccountNumber())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Account not found with account number: " + request.getAccountNumber());
        }

        // check if amount is less than account balance
        BigDecimal accountBalance = accountService.getAccountBalanceByAccountNumber(request.getAccountNumber());
        if (accountBalance == null || request.getAmount().compareTo(accountBalance) > 0) {
            return ResponseEntity.badRequest().body("Insufficient funds for withdrawal"); // Return 400 Bad Request if insufficient funds
        }

        // Check if amount is negative or zero
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body("Amount must be greater than zero"); // Return 400 Bad Request if amount is negative or zero
        }

        // check if account is closed
        if (transactionService.isAccountClosed(request.getAccountNumber())) {
            // return 409 Conflict if the account is closed
            return ResponseEntity.status(HttpStatusCode.valueOf(409)).body("Account is closed, can't make a withdrawal");
        }

        // check if fields are empty
        if (request.getAccountNumber() == null || request.getAccountNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("Account number can't be empty"); // Return 400 Bad Request if account number is empty
        }
        if (request.getDescription() == null || request.getDescription().isEmpty()) {
            return ResponseEntity.badRequest().body("Description can't be empty"); // Return 400 Bad Request if description is empty
        }
        if (request.getCategoryName() == null || request.getCategoryName().isEmpty()) {
            return ResponseEntity.badRequest().body("Category name can't be empty"); // Return 400 Bad Request if category name is empty
        }
        if (request.getAmount() == null) {
            return ResponseEntity.badRequest().body("Amount can't be empty"); // Return 400 Bad Request if amount is empty
        }

        // check if category exists
        if (!transactionService.categoryExists(request.getCategoryName())) {
            return ResponseEntity.badRequest().body("Category doesn't exist"); // Return 400 Bad Request if category does not exist
        }
        // make a withdrawal transaction
        TransactionDto transactionDto = transactionService.withdraw(request);
        // Return the transaction details with a 201 Created status
        return ResponseEntity.status(201).body(transactionDto);
    }

    // Transfer money between accounts
    @PostMapping("/{userId}/transfer")//
    public ResponseEntity<?> transfer(@RequestBody TransferRequest request) {
        // Check if source account number exists
        if (!transactionService.accountExists(request.getFromAccount())) {
            return ResponseEntity.badRequest().body("Source account doesn't exist"); // Return 400 Bad Request if source account number does not exist
        }
        // Check if destination account number exists
        if (!transactionService.accountExists(request.getToAccount())) {
            return ResponseEntity.badRequest().body("Destination account doesn't exist"); // Return 400 Bad Request if destination account number does not exist
        }
        // Check if amount is more than from account balance
        BigDecimal fromAccountBalance = accountService.getAccountBalanceByAccountNumber(request.getFromAccount());
        if (fromAccountBalance == null || request.getAmount().compareTo(fromAccountBalance) > 0) {
            return ResponseEntity.badRequest().body("Insufficient funds for transfer"); // Return 400 Bad Request if insufficient funds
        }
        // Check if amount is negative or zero
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body("Amount must be greater than zero"); // Return 400 Bad Request if amount is negative or zero
        }
        // check if fields are empty
        if (request.getFromAccount() == null || request.getFromAccount().isEmpty()) {
            return ResponseEntity.badRequest().body("Source account number can't be empty"); // Return 400 Bad Request if source account number is empty
        }
        if (request.getToAccount() == null || request.getToAccount().isEmpty()) {
            return ResponseEntity.badRequest().body("Destination account number can't be empty"); // Return 400 Bad Request if destination account number is empty
        }
        if (request.getDescription() == null || request.getDescription().isEmpty()) {
            return ResponseEntity.badRequest().body("Description can't be empty"); // Return 400 Bad Request if description is empty
        }
        if (request.getAmount() == null) {
            return ResponseEntity.badRequest().body("Amount can't be empty"); // Return 400 Bad Request if amount is empty
        }
        // check if accounts are closed
        if (transactionService.isAccountClosed(request.getFromAccount())) {
            // return 409 Conflict if the source account is closed
            return ResponseEntity.status(HttpStatusCode.valueOf(409)).body("Source account is closed, can't make a transfer");
        }
        if (transactionService.isAccountClosed(request.getToAccount())) {
            // return 409 Conflict if the destination account is closed
            return ResponseEntity.status(HttpStatusCode.valueOf(409)).body("Destination account is closed, can't receive a transfer");
        }
        // Check if the source and destination accounts are the same
        if (request.getFromAccount().equals(request.getToAccount())) {
            return ResponseEntity.badRequest().body("Source and destination accounts cannot be the same"); // Return 400 Bad Request if accounts are the same
        }
        // make a transfer transaction
        TransferDto transfer = transactionService.transfer(request);
        // Return the transaction details with a 201 Created status
        return ResponseEntity.status(201).body(transfer);
    }

    @GetMapping("/{userId}/account")
    public ResponseEntity<?> getAllTransactionsByUserId(
            @PathVariable Long userId
    ) {
        // Fetch all transactions for the specified user ID
        List<TransactionDto> transactions = transactionService.getAllTransactions(userId);

        // If no transactions are found, return a 200 OK status with a message
        if (transactions.isEmpty()) {
            return ResponseEntity.ok(transactions); // Return 200 OK with a message if no transactions are found
        }
        // Return the list of transactions with a 200 OK status
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{userId}/total")
    public ResponseEntity<?> getTransactionsCount(
            @PathVariable Long userId
    ) {
        // Fetch all transactions for the specified user ID
        List<TransactionDto> transactions = transactionService.getAllTransactions(userId);

        int transactionsCount = transactions.size();

        TotalTransactionsDto totalTransactionsDto = new TotalTransactionsDto(transactionsCount);

        // If no transactions are found, return a 200 OK status with zero
        if (transactions.isEmpty()) {
            return ResponseEntity.ok(BigDecimal.ZERO); // Return 200 OK with zero if no transactions are found
        }

        // Return the total transactions count with a 200 OK status
        return ResponseEntity.ok(totalTransactionsDto);
    }





}
