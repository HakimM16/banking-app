package com.hakimmabike.bankingbackend.dto;

import com.hakimmabike.bankingbackend.enums.AccountStatus;
import com.hakimmabike.bankingbackend.enums.AccountType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateAccountRequest {
    private AccountType accountType;
    private BigDecimal balance;
    private AccountStatus status;
}
