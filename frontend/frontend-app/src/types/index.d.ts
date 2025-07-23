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

// TransferDto
export interface Transfer {
    id: number;
    amount: Decimal;
    description: string;
    fromAccount: string;
    toAccount: string;
}

// TransactionCategoryDto
export interface transactionCategory {
    id: number;
    name: string;
    description: string;
    categoryType: string;
    isSystemCategory: boolean;
}

// JwtResponse
export interface JwtResponse {
    accessToken: string;
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

// BalanceDto
export interface Balance {
    accountNumber: string;
    balance: Decimal;
}

// RegisterUserRequest
export interface RegisterFormInputs {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: String;
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

// DeleteAccountRequest
export interface DeleteAccountRequest {
    accountNumber: string;
    accountType: string;
    reason: string;
}

// Balance
export interface accountBalance {
    accountNumber: string;
    balance: Decimal; // Use Decimal for precise financial calculations
}

// DepositRequest
export interface DepositFormInputs {
    accountNumber: string;
    amount: Decimal;
    description: string;
    categoryName: string; // Optional, if you want to categorize deposits
}

// GetTransactionCategoryRequest
export interface GetTransactionCategoryRequest {
    name: string;
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
    status: string; // e.g., 'active', 'inactive', 'closed'
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