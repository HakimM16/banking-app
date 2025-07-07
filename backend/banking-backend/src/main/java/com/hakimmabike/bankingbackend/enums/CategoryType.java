package com.hakimmabike.bankingbackend.enums;

public enum CategoryType {
    PENDING("pending"),
    COMPLETED("completed"),
    FAILED("failed");

    private final String value;

    CategoryType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
