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
    private String transactionType;
    private BigDecimal amount;
    private BigDecimal balanceAfterTransaction;
    private String categoryName;
    private String description;
}
