package com.hakimmabike.bankingbackend.dto.account;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@AllArgsConstructor
@Getter
public class BalanceDto {
    private String accountNumber;
    private BigDecimal balance;
}
