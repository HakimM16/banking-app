// src/types/index.d.ts
import { Decimal } from 'decimal.js';

// In this file, we define the DTOs (Data Transfer Objects) from the backend to the frontend in TypeScript.

// UserDto
export interface User {
    id: number;
    email: string
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

// UserAddressDto
export interface Address {
    id: number;
    street: string;
    city: string;
    postCode: string;
    country: string;
    county: string;
    userId: number;
}

export interface ProfileFormInputs {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    county: string;
    postCode: string;
    country: string;
}

// TransactionDto
export interface Transaction {
    id: number;
    transactionNumber: string;
    transactionType: string;
    accountNumber: string;
    amount: Decimal;
    balanceAfter: Decimal;
    categoryName: string;
    description: string;
    code: string;
    sender: boolean;
    receiver: boolean;
}

// AccountDto
export interface Account {
    id: number;
    accountNumber: string;
    accountType: string;
    balance: Decimal;
    status: string;
}

export interface AccountCount {
    accountsCount: number;
}

export interface TransactionCount {
    transactionsCount: number;
}

// EmailDto
export interface Email {
    email: string;
}

// RegisterUserRequest
export interface RegisterFormInputs {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: string;
}

// TransferRequest
export interface TransferFormInputs {
    fromAccount: string;
    toAccount: string;
    amount: Decimal; // Use string for input, convert to number for processing
    description: string;
}

// LoginUserRequest
export interface LoginFormInputs {
    email: string;
    password: string;
}

// CreateAccountRequest
export interface CreateAccountFormInputs {
    accountType: string;
}

// createTransactionCategoryRequest
export interface CreateTransactionCategoryFormInputs {
    name: string;
    description: string;
    categoryType: string;
    isSystem: boolean;
}

// CustomiseAddressRequest
export interface CustomiseAddressFormInputs {
    street: string;
    city: string;
    county: string;
    postCode: string;
    country: string;
}

// DepositRequest
export interface DepositFormInputs {
    accountNumber: string;
    amount: Decimal;
    description: string;
    categoryName: string; // Optional, if you want to categorize deposits
}


// GetTransactionsRequest
export interface GetTransactionsRequest {
    accountNumber: string;
}

// UpdateAccountRequest
export interface UpdateAccountFormInputs {
    accountType: string;
}

// UpdateAccountStatusRequest
export interface UpdateAccountStatusFormInputs {
    status: string; // e.g., 'OPEN', 'CLOSED'
}

// UpdateStatusRequest
export interface UpdateStatusFormInputs {
    status: string; // e.g., 'active', 'inactive', 'closed'
}

// UpdateUserRequest
export interface UpdateUserFormInputs {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

// withdrawRequest
export interface WithdrawFormInputs {
    accountNumber: string;
    amount: Decimal;
    description: string;
    categoryName: string; // Optional, if you want to categorize withdrawals
}

// TotalBalanceResponse
export interface TotalBalanceResponse {
    balance: number;
}

