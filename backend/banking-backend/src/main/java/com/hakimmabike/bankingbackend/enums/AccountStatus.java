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

    // valid status
    public static boolean isValidStatus(String status) {
        for (AccountStatus accountStatus : AccountStatus.values()) {
            if (accountStatus.getValue().equalsIgnoreCase(status)) {
                return true;
            }
        }
        return false;
    }
}
