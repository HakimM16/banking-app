package com.hakimmabike.bankingbackend.enums;

public enum TransactionType {
    DEPOSIT("deposit"),
    WITHDRAWAL("withdrawal"),
    TRANSFER("transfer");

    private final String value;

    TransactionType(String value) {
        this.value = value;
    }

    public static boolean isValidCategoryType(String categoryType) {
        for (TransactionType type : TransactionType.values()) {
            if (type.getValue().equalsIgnoreCase(categoryType)) {
                return true;
            }
        }
        return false;
    }

    public String getValue() {
        return value;
    }
}
