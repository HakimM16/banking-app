package com.hakimmabike.bankingbackend.exception;

public class ExistingBalanceException extends RuntimeException {
    public ExistingBalanceException(String message) {
        super(message);
    }
}
