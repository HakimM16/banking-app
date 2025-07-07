package com.hakimmabike.bankingbackend.enums;

public enum AccountType {
    DEBIT("debit"),
    SAVINGS("savings"),
    CREDIT("credit");

    private final String value;

    AccountType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
