package com.hakimmabike.bankingbackend.controller;

import com.hakimmabike.bankingbackend.dto.*;
import com.hakimmabike.bankingbackend.enums.TransactionType;
import com.hakimmabike.bankingbackend.repository.TransactionCategoryRepository;
import com.hakimmabike.bankingbackend.repository.TransactionRepository;
import com.hakimmabike.bankingbackend.services.TransactionService;
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
    private final TransactionCategoryRepository categoryRepository;

    // Deposit money into an account
    @PostMapping("/{userId}/deposit")
    public ResponseEntity<TransactionDto> deposit(
            @PathVariable Long userId,
            @RequestBody DepositRequest request
    ) {
        // make a deposit transaction
        TransactionDto transactionDto = transactionService.deposit(userId,request);
        // Return the transaction details with a 201 Created status
        return ResponseEntity.status(201).body(transactionDto);
    }

    // Withdraw money from an account
    @PostMapping("/{userId}/withdraw")
    public ResponseEntity<TransactionDto> withdraw(@RequestBody WithdrawRequest request) {
        // make a withdrawal transaction
        TransactionDto transactionDto = transactionService.withdraw(request);
        // Return the transaction details with a 201 Created status
        return ResponseEntity.status(201).body(transactionDto);
    }

    // Transfer money between accounts
    @PostMapping("/{userId}/transfer")
    public ResponseEntity<TransferDto> transfer(@RequestBody TransferRequest request) {
        // make a transfer transaction
        TransferDto transfer = transactionService.transfer(request);
        // Return the transaction details with a 201 Created status
        return ResponseEntity.status(201).body(transfer);
    }

    // Get all transactions for an account
    @GetMapping("/{userId}/account/{accountId}")
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

    // Create a new transaction category
    @PostMapping("/category")
    public ResponseEntity<?> createTransactionCategory(@RequestBody CreateTransactionCategoryRequest request) {
        // Check if name is provided
        if (request.getName() == null || request.getName().isEmpty()) {
            return ResponseEntity.badRequest().body("Name can't be empty"); // Return 400 Bad Request if name is missing
        }

        // check if category exists
        if (categoryRepository.existsByName(request.getName())) {
            return ResponseEntity.status(409).body("Category already exists"); // Return 409 Conflict if category already exists
        }

        // check if category type is valid
        if (!TransactionType.isValidCategoryType(request.getCategoryType())) {
            return ResponseEntity.badRequest().body("Category type is invalid"); // Return 400 Bad Request if category type is missing
        }
        // Create a new transaction category
        TransactionCategoryDto createdCategory = transactionService.createTransactionCategory(request);
        // Return the created category with a 201 Created status
        return ResponseEntity.status(201).body(createdCategory);
    }

    // Get a specific transaction category by name
    @GetMapping("/category/{name}")
    public ResponseEntity<TransactionCategoryDto> getTransactionCategory(@RequestBody GetTransactionCategoryRequest request) {
        // Fetch the transaction category by name
        TransactionCategoryDto category = transactionService.getTransactionCategory(request.getName());

        // If the category is not found, return a 404 Not Found status
        if (category == null) {
            return ResponseEntity.notFound().build();
        }

        // Return the category with a 200 OK status
        return ResponseEntity.ok(category);
    }

    // Get all transaction categories
    @GetMapping("/categories")
    public ResponseEntity<List<TransactionCategoryDto>> getAllTransactionCategories() {
        // Fetch all transaction categories
        List<TransactionCategoryDto> categories = transactionService.getAllTransactionCategories();
        // Return the list of categories with a 200 OK status
        return ResponseEntity.ok(categories);
    }
}
