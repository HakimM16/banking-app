package com.hakimmabike.bankingbackend.controller;

import com.hakimmabike.bankingbackend.dto.*;
import com.hakimmabike.bankingbackend.enums.AccountType;
import com.hakimmabike.bankingbackend.repository.AccountRepository;
import com.hakimmabike.bankingbackend.repository.UserRepository;
import com.hakimmabike.bankingbackend.services.AccountService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

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
    public ResponseEntity<AccountDto> updateAccountStatus(
            @PathVariable Long accountId,
            @RequestBody UpdateAccountStatusRequest request
    ) {
        AccountDto updatedAccount = accountService.changeAccountStatus(accountId, request);
        if (updatedAccount == null) {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if the account does not exist
        }
        return ResponseEntity.ok(updatedAccount); // Return the updated account mapped to a DTO with a 200 OK status
    }

    // Delete an existing account
    @DeleteMapping("/{userId}/{accountId}")
    public void closeAccount(@PathVariable Long accountId, @RequestBody DeleteAccountRequest request) {
        accountService.deleteAccount(accountId, request);
    }

    // Get account by ID
    @GetMapping("/{userId}/{accountId}")
    public ResponseEntity<AccountDto> getAccount(@PathVariable Long accountId) {
        AccountDto accountDto = accountService.getAccountById(accountId);
        if (accountDto == null) {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if the account does not exist
        }
        return ResponseEntity.ok(accountDto); // Return the account mapped to a DTO with a 200 OK status
    }

    // update an existing account
    @PutMapping("/{userId}/{accountId}")
    public ResponseEntity<AccountDto> updateAccount(
            @PathVariable Long accountId,
            @RequestBody UpdateAccountRequest request
    ) {
        AccountDto updatedAccount = accountService.updateAccount(accountId, request);
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
