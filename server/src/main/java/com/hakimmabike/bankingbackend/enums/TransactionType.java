package com.hakimmabike.bankingbackend.enums;

public enum TransactionType {
    DEPOSIT("deposit"),
    WITHDRAWAL("withdrawal"),
    TRANSFER("transfer");

    private final String value;

    TransactionType(String value) {
        this.value = value;
    }

    public static boolean isValidTransactionType(String categoryType) {
        for (TransactionType type : TransactionType.values()) {
            if (type.value.equalsIgnoreCase(categoryType)) {
                System.out.println("Valid transaction type: " + type.value);
                return true;
            }
            System.out.println(type.value);
        }
        return false;
    }

    public String getValue() {
        return value;
    }
}
