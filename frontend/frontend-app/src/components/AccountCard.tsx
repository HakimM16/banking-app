// src/components/AccountCard.tsx
import React from 'react';
import { CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import { Account } from '@/types'; // Import type

interface AccountCardProps {
    account: Account;
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    account.accountType === 'DEBIT' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                    <CreditCard size={20} />
                </div>
                <div>
                    <p className="font-medium">{account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()}</p>
                    <p className="text-sm text-gray-600">{account.accountNumber}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold">{formatCurrency(account.balance)}</p>
                <p className={`text-sm ${account.status === 'OPEN' ? 'text-green-600' : 'text-red-600'}`}>
                    {account.status}
                </p>
            </div>
        </div>
    );
};

export default AccountCard;