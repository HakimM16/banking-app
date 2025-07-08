package com.hakimmabike.bankingbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@AllArgsConstructor
@Getter
public class TransferDto {
    private Long id;
    private BigDecimal amount;
    private String description;
    private String senderAccountNumber;
    private String receiverAccountNumber;
}
