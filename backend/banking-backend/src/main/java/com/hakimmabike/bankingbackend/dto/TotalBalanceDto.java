package com.hakimmabike.bankingbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@AllArgsConstructor
@Getter
public class TotalBalanceDto {
    private BigDecimal balance;
}
