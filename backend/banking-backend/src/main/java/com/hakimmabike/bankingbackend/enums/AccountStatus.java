package com.hakimmabike.bankingbackend.enums;

public enum AccountStatus {
    OPEN("open"),
    CLOSED("closed"),
    FROZEN("frozen");

    private final String value;

    AccountStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
