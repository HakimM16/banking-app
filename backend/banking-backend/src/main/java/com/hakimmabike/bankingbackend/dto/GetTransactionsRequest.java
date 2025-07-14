package com.hakimmabike.bankingbackend.dto;

import lombok.Data;

@Data
public class GetTransactionsRequest {
    private String accountNumber;
}
