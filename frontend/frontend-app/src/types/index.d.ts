// src/types/index.d.ts
import { Decimal } from 'decimal.js';

export interface User {
    id: number;
    email: string
    firstName: string;
    lastName: string;
    phone: string;
}

export interface Address {
    id: number;
    street: string;
    city: string;
    postCode: string;
    country: string;
    userId: number;
}

export interface Transaction {
    id: number;
    transactionNumber: string;
    transactionType: string;
    amount: Decimal;
    balanceAfter: Decimal;
    category: string;
    description: string;
}

export interface Transfer {
    id: number;
    amount: Decimal;
    description: string;
    fromAccount: string;
    toAccount: string;
}

export interface transactionCategory {
    id: number;
    name: string;
    description: string;
    categoryType: string;
    isSystemCategory: boolean;
}

export interface Token {
    accessToken: string;
}

export interface Account {
    id: number;
    accountNumber: string;
    accountType: string;
    balance: Decimal;
    status: string;
}

export interface Balance {
    accountNumber: string;
    balance: Decimal;
}

