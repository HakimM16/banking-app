package com.hakimmabike.bankingbackend.enums;

public enum CategoryType {
    INCOME("income"),
    EXPENSE("expense"),
    TRANSFER("transfer");

    private final String value;

    CategoryType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
