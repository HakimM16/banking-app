// src/types/index.d.ts

export interface Account {
    id: string;
    type: 'checking' | 'savings';
    balance: number;
    accountNumber: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    password?: string; // Password should ideally not be returned to the client
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    accounts: Account[];
}

export interface Transaction {
    id: string;
    userId: number;
    fromAccount: string | null;
    toAccount: string | null;
    amount: number;
    type: 'transfer' | 'deposit' | 'withdrawal';
    description: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
}

export interface AlertState {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    timestamp: string;
}

// Form data interfaces
export interface LoginFormInputs {
    username: string;
    password: string;
}

export interface RegisterFormInputs {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
}

export interface TransferFormInputs {
    fromAccount: string;
    toAccount: string;
    amount: string; // Use string for input, convert to number for processing
    description: string;
}

export interface DepositFormInputs {
    account: string;
    amount: string;
    description: string;
}

export interface WithdrawalFormInputs {
    account: string;
    amount: string;
    description: string;
}

export interface ProfileFormInputs {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
}