package com.hakimmabike.bankingbackend.enums;

import jakarta.validation.constraints.NotNull;

public enum AccountType {
    DEBIT("debit"),
    SAVINGS("savings"),
    CREDIT("credit");

    private final String value;

    AccountType(String value) {
        this.value = value;
    }

    public static boolean isValidType(String accountType) {
        for (AccountType type : AccountType.values()) {
            if (type.value.equalsIgnoreCase(accountType)) {
                return true;
            }
        }
        return false;
    }

    public String getValue() {
        return value;
    }
}
