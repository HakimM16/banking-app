package com.hakimmabike.bankingbackend.controller;

import com.hakimmabike.bankingbackend.dto.*;
import com.hakimmabike.bankingbackend.enums.AccountStatus;
import com.hakimmabike.bankingbackend.enums.AccountType;
import com.hakimmabike.bankingbackend.repository.AccountRepository;
import com.hakimmabike.bankingbackend.repository.UserRepository;
import com.hakimmabike.bankingbackend.services.AccountService;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;

@RestController
@AllArgsConstructor
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountService accountService;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    // Create a new account
    @PostMapping("/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
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
    @PatchMapping("/{userId}/{accountId}/status")
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

    // Delete an existing account
    @DeleteMapping("/{userId}/{accountId}")
    public ResponseEntity<?> closeAccount(@PathVariable Long accountId, @RequestBody DeleteAccountRequest request) {
        // check if account ID is valid
        if (!accountRepository.existsById(accountId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Account with ID " + accountId + " does not exist.");
        }

        //check if account number is valid
        if (!accountRepository.existsByAccountNumber(request.getAccountNumber()) && !request.getAccountNumber().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Account number " + request.getAccountNumber() + " is invalid.");
        } else if (request.getAccountNumber().equals("") || request.getAccountNumber().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Account number cannot be blank.");
        }

        // Check if account type is valid
        if (!AccountType.isValidType(request.getAccountType()) && !request.getAccountType().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid account type: " + request.getAccountType());
        } else if (request.getAccountType().equals("") || request.getAccountType().isBlank()) {
            // check if account type or account Type is blank
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Account type cannot be blank.");
        }

        if (request.getReason() == null || request.getReason().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Reason for account closure cannot be blank.");
        }


        // Check if the account has a balance
        if (accountRepository.findById(accountId).orElseThrow().getBalance().compareTo(BigDecimal.ZERO) != 0) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Cannot delete account with a non-zero balance. Please withdraw or transfer funds first.");
        }

        accountService.deleteAccount(accountId, request);
        return ResponseEntity.ok().build();
    }

    // Get account by ID
    @GetMapping("/{userId}/{accountId}")
    public ResponseEntity<?> getAccount(@PathVariable Long userId,@PathVariable Long accountId) {
        // Check if account ID is valid
        if (!accountRepository.existsByIdAndUserId(accountId, userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Account with ID " + accountId + " does not exist.");
        }
        AccountDto accountDto = accountService.getAccountById(accountId, userId);
        if (accountDto == null) {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if the account does not exist
        }
        return ResponseEntity.ok(accountDto); // Return the account mapped to a DTO with a 200 OK status
    }

    // update type on existing account
    @PatchMapping("/{userId}/{accountId}")
    public ResponseEntity<?> updateAccountType(
            @PathVariable Long userId,
            @PathVariable Long accountId,
            @RequestBody UpdateAccountRequest request
    ) {
        // Check if account ID is valid
        if (!accountRepository.existsByIdAndUserId(accountId, userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Account with ID " + accountId + " does not exist.");
        }

        // Check if account type is valid
        if (request.getAccountType() == null || request.getAccountType().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Account type cannot be blank.");
        }

        if (!AccountType.isValidType(request.getAccountType())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid account type: " + request.getAccountType());
        }



        // Check if account is closed
        if (accountRepository.findById(accountId).orElseThrow().getStatus() == AccountStatus.CLOSED) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Account with ID " + accountId + " is closed and cannot be updated.");
        }

        // check if there is already an account with the same type for the user
        if (accountRepository.existsByUserAndAccountType(userRepository.findById(userId).orElseThrow(), AccountType.valueOf(request.getAccountType()))) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User with ID " + userId + " already has an account of type " + request.getAccountType() + ".");
        }

        AccountDto updatedAccount = accountService.updateAccountType(userId, accountId, request);
        if (updatedAccount == null) {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if the account does not exist
        }
        return ResponseEntity.ok(updatedAccount); // Return the updated account mapped to a DTO with a 200 OK status
    }

    // Get all accounts for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAllAccountsByUserId(@PathVariable Long userId) {
        var accounts = accountService.getUserAccounts(userId);
        if (accounts.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if no accounts found
        }
        return ResponseEntity.ok(accounts); // Return the list of accounts with a 200 OK status
    }

    // Get account balance
    @GetMapping("/{userId}/{accountId}/balance")
    public ResponseEntity<?> getBalance(@PathVariable Long accountId) {
        var balance = accountService.getAccountBalance(accountId);
        if (balance == null) {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if the account does not exist
        }
        return ResponseEntity.ok(balance); // Return the account balance with a 200 OK status
    }

}
