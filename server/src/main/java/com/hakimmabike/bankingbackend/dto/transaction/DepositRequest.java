package com.hakimmabike.bankingbackend.dto.transaction;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DepositRequest {
    private String accountNumber;
    private BigDecimal amount;
    private String description;
    private String categoryName;
}
