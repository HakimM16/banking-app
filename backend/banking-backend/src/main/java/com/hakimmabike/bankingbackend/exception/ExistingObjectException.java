package com.hakimmabike.bankingbackend.exception;

public class ExistingObjectException extends RuntimeException {
    public ExistingObjectException(String message) {
        super(message);
    }
}
