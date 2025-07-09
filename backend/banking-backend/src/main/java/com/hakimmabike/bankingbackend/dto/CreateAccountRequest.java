package com.hakimmabike.bankingbackend.dto;

import com.hakimmabike.bankingbackend.enums.AccountType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateAccountRequest {
    @NotNull(message = "Account Type is required")
    private AccountType accountType;
}
