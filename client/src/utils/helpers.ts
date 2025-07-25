// src/utils/helpers.ts
// src/utils/helpers.ts
import { Account } from '@/types';
import { Decimal } from "decimal.js";

export const formatCurrency = (amount: Decimal | number): string => {
    const numericValue = amount instanceof Decimal ? amount.toNumber() : Number(amount);
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'GBP',
    }).format(numericValue);
};

export const getAccountDisplayName = (account?: Account | null): string => {
    if (!account) return 'N/A';
    return `${account.accountType.toLowerCase()} ${account.accountNumber}`;
};