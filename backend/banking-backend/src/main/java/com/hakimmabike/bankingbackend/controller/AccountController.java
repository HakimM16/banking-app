package com.hakimmabike.bankingbackend.controller;

import com.hakimmabike.bankingbackend.dto.AccountDto;
import com.hakimmabike.bankingbackend.dto.CreateAccountRequest;
import com.hakimmabike.bankingbackend.dto.DeleteAccountRequest;
import com.hakimmabike.bankingbackend.dto.UpdateAccountRequest;
import com.hakimmabike.bankingbackend.repository.AccountRepository;
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

    // Create a new account
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<AccountDto> createAccount(
            @RequestParam Long userId,
            @RequestBody CreateAccountRequest request,
            UriComponentsBuilder uriBuilder
    ) {
        // Create the account
        AccountDto accountDto = accountService.createAccount(userId, request);

        // Build the URI for the newly created account resource
        var uri = uriBuilder.path("/accounts/{accountId}")
                .buildAndExpand(accountDto.getId())
                .toUri();

        // Return a 201 Created response with the location of the new resource
        return ResponseEntity.created(uri).body(accountDto);
    }

    // Close an existing account
    @DeleteMapping("/{accountId}")
    public void closeAccount(@PathVariable Long accountId, @RequestBody DeleteAccountRequest request) {
        accountService.closeAccount(accountId, request);
    }

    // Get account by ID
    @GetMapping("/{accountId}")
    public ResponseEntity<AccountDto> getAccount(@PathVariable Long accountId) {
        AccountDto accountDto = accountService.getAccountById(accountId);
        if (accountDto == null) {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if the account does not exist
        }
        return ResponseEntity.ok(accountDto); // Return the account mapped to a DTO with a 200 OK status
    }

    // update an existing account
    @PutMapping("/{accountId}")
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
    @GetMapping("/{accountId}/balance")
    public ResponseEntity<?> getBalance(@PathVariable Long accountId) {
        var balance = accountService.getAccountBalance(accountId);
        if (balance == null) {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if the account does not exist
        }
        return ResponseEntity.ok(balance); // Return the account balance with a 200 OK status
    }

}
