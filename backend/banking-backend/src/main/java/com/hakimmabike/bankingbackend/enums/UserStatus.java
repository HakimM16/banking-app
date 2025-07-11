package com.hakimmabike.bankingbackend.enums;

import jakarta.validation.constraints.NotBlank;

public enum UserStatus {
    ACTIVE("active"),
    INACTIVE("inactive"),
    SUSPENDED("suspended");

    private final String value;

    UserStatus(String value) {
        this.value = value;
    }

    public static boolean isValidStatus(String status) {
        for (UserStatus userStatus : UserStatus.values()) {
            if (userStatus.getValue().equalsIgnoreCase(status)) {
                return true;
            }
        }


        return false;
    }

    public String getValue() {
        return value;
    }
}
