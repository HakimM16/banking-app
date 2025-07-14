package com.hakimmabike.bankingbackend.dto;

import com.hakimmabike.bankingbackend.enums.AccountType;
import lombok.Data;

@Data
public class DeleteAccountRequest {
    private String accountNumber;
    private String accountType;
    private String reason;
}
