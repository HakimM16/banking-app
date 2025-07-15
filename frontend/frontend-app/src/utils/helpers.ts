// src/utils/helpers.ts
import { Account } from '@/types'; // Import Account type

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const getAccountDisplayName = (account?: Account | null): string => {
    if (!account) return 'N/A';
    return `${account.type.charAt(0).toUpperCase() + account.type.slice(1)} ${account.accountNumber}`;
};