package com.hakimmabike.bankingbackend.controller;

import com.hakimmabike.bankingbackend.dto.account.*;
import com.hakimmabike.bankingbackend.dto.transaction.DepositRequest;
import com.hakimmabike.bankingbackend.dto.transaction.TransactionDto;
import com.hakimmabike.bankingbackend.enums.AccountStatus;
import com.hakimmabike.bankingbackend.enums.AccountType;
import com.hakimmabike.bankingbackend.repository.AccountRepository;
import com.hakimmabike.bankingbackend.repository.UserRepository;
import com.hakimmabike.bankingbackend.services.AccountService;
import com.hakimmabike.bankingbackend.services.TransactionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@AllArgsConstructor
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountService accountService;
    private final TransactionService transactionService;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    // Create a new account
    @PostMapping("/{userId}")
    @ResponseStatus(HttpStatus.CREATED)//
    public ResponseEntity<?> createAccount(
            @PathVariable Long userId,
            @RequestBody CreateAccountRequest request,
            UriComponentsBuilder uriBuilder
    ) {
        // Check if the user exists
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User with ID " + userId + " does not exist.");
        }

        // Check if the account type is valid
        if (!AccountType.isValidType(request.getAccountType())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid account type: " + request.getAccountType());
        }
        // check if the account type is blank
        if (request.getAccountType() == null || request.getAccountType().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Account type cannot be blank.");
        }

        // Check if user has 3 or more accounts
        if (accountRepository.countByUserId(userId) >= 3) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("User with ID " + userId + " already has 3 accounts.");
        }

        // Create the account
        AccountDto accountDto = accountService.createAccount(userId, request);

        // Build the URI for the newly created account resource
        var uri = uriBuilder.path("/{userId}/{accountId}")
                .buildAndExpand(userId, accountDto.getId())
                .toUri();

        // Return a 201 Created response with the location of the new resource
        return ResponseEntity.created(uri).body(accountDto);
    }

    // Update account status
    @PatchMapping("/{userId}/{accountId}/status")//
    public ResponseEntity<?> updateAccountStatus(
            @PathVariable Long userId,
            @PathVariable Long accountId,
            @RequestBody UpdateAccountStatusRequest request
    ) {
        // check if account ID is found
        if (!accountRepository.existsById(accountId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Account with ID " + accountId + " does not exist.");
        }

        // check if account status is valid
        if (!AccountStatus.isValidStatus(request.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid account status: " + request.getStatus());
        }

        // Check if account is closed
        if (request.getStatus().equalsIgnoreCase("CLOSED")) {
            if (accountRepository.findById(accountId).orElseThrow().getStatus() == AccountStatus.CLOSED) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Account with ID " + accountId + " is already closed.");
            }
        }

        // Check if status is blank
        if (request.getStatus() == null || request.getStatus().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Account status cannot be blank.");
        }

        AccountDto updatedAccount = accountService.changeAccountStatus(userId, accountId, request);
        if (updatedAccount == null) {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if the account does not exist
        }
        return ResponseEntity.ok(updatedAccount); // Return the updated account mapped to a DTO with a 200 OK status
    }

    // Get all accounts for a user
    @GetMapping("/user/{userId}")//
    public ResponseEntity<?> getAllAccountsByUserId(@PathVariable Long userId) {
        // Check if user ID is valid
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User with ID " + userId + " does not exist.");
        }

        // check if user doesn't have any accounts
        if (!accountRepository.existsByUserId(userId)) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if the user has no accounts
        }
        var accounts = accountService.getUserAccounts(userId);
        if (accounts.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if no accounts found
        }
        return ResponseEntity.ok(accounts); // Return the list of accounts with a 200 OK status
    }

    // Get account balance
    @GetMapping("/{userId}/{accountId}/balance")//
    public ResponseEntity<?> getBalance(
            @PathVariable Long userId,
            @PathVariable Long accountId
    ) {
        // Check if account ID is valid
        if (!accountRepository.existsByIdAndUserId(accountId, userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Account with ID " + accountId + " does not exist.");
        }
        // check if account is closed
        if (accountRepository.findById(accountId).orElseThrow().getStatus() == AccountStatus.CLOSED) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Account with ID " + accountId + " is closed and cannot be accessed.");
        }

        BalanceDto balance = accountService.getAccountBalance(accountId, userId);
        if (balance == null) {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if the account does not exist
        }
        return ResponseEntity.ok(balance); // Return the account balance with a 200 OK status
    }

    // Get total balance for a user
    @GetMapping("/{userId}/total-balance")//
    public ResponseEntity<?> getTotalBalance(@PathVariable Long userId) {
        // Check if user ID is valid
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User with ID " + userId + " does not exist.");
        }

        // Get the total balance for the user
        TotalBalanceDto totalBalance = accountService.getTotalBalance(userId);
        if (totalBalance == null) {
            return ResponseEntity.ok("User with ID " + userId + " has no accounts or balance."); // Return a message if no accounts found
        }
        return ResponseEntity.ok(totalBalance); // Return the total balance with a 200 OK status
    }

    // Get number of active accounts for a user
    @GetMapping("/{userId}/active-accounts")//
    public ResponseEntity<?> getActiveAccountsCount(@PathVariable Long userId) {
        // Check if user ID is valid
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User with ID " + userId + " does not exist.");
        }

        ActiveAccountsDto activeAccountsCount = accountService.getActiveAccountsCount(userId);
        return ResponseEntity.ok(activeAccountsCount); // Return the count with a 200 OK status
    }

    // Deposit money into an account
    @PostMapping("/transaction/{userId}/deposit")//
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

}
