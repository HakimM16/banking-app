package com.hakimmabike.bankingbackend.exception;

public class ObjectExistsException extends RuntimeException {
    public ObjectExistsException(String message) {
        super(message);
    }
}
