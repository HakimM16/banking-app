// src/components/AccountCard.tsx
import React from 'react';
import { CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import { Account } from '@/types'; // Import type

// Props interface for AccountCard component
interface AccountCardProps {
    account: Account; // Account object to display
}

// AccountCard component displays account details in a card layout
const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            {/* Left section: Icon and account info */}
            <div className="flex items-center gap-3">
                {/* Account type icon with color based on account type */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    account.accountType === 'DEBIT' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                    <CreditCard size={20} />
                </div>
                <div>
                    {/* Account type label */}
                    <p className="font-medium">
                        {account.accountType === 'CREDIT' ?
                        'ISA' : account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()}
                    </p>
                    {/* Masked account number */}
                    <p className="text-sm text-gray-600">
                        {"*".repeat(4) + account.accountNumber.slice(4)}
                    </p>
                </div>
            </div>
            {/* Right section: Balance and status */}
            <div className="text-right">
                {/* Formatted account balance */}
                <p className="font-semibold">{formatCurrency(account.balance)}</p>
                {/* Account status with color */}
                <p className={`text-sm ${account.status === 'OPEN' ? 'text-green-600' : 'text-red-600'}`}>
                    {account.status}
                </p>
            </div>
        </div>
    );
};

export default AccountCard;