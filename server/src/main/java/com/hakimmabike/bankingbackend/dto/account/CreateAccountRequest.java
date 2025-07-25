package com.hakimmabike.bankingbackend.dto.account;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateAccountRequest {
    @NotNull(message = "Account Type is required")
    private String accountType;
}
