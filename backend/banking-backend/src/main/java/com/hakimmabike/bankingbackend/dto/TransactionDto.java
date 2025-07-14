package com.hakimmabike.bankingbackend.dto;

import com.hakimmabike.bankingbackend.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@AllArgsConstructor
@Getter
public class TransactionDto {
    private Long id;
    private String transactionNumber;
    private TransactionType transactionType;
    private BigDecimal amount;
    private Double balanceAfterTransaction;
    private String description;
}
