package com.hakimmabike.bankingbackend.exception;

public class TransferException extends RuntimeException {
    public TransferException(String message) {
        super(message);
    }
}
