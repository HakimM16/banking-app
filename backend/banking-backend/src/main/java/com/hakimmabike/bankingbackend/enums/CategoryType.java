package com.hakimmabike.bankingbackend.enums;

public enum CategoryType {
    INCOME("income"),
    EXPENSE("expense"),
    TRANSFER("transfer");

    private final String value;

    CategoryType(String value) {
        this.value = value;
    }

    public static boolean isValidCategoryType(String categoryType) {
        for (CategoryType type : CategoryType.values()) {
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
