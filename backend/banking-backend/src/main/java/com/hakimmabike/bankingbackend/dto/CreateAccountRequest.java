package com.hakimmabike.bankingbackend.dto;

import com.hakimmabike.bankingbackend.enums.AccountType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateAccountRequest {
    @NotBlank(message = "Account Type is required")
    private AccountType accountType;
}
