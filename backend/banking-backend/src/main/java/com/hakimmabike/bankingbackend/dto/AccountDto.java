package com.hakimmabike.bankingbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AccountDto {
    private Long id;
    private String accountNumber;
    private String accountType;
    private String balance;
    private String status;
}
