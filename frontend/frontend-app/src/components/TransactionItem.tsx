// src/components/TransactionItem.tsx
import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { formatCurrency, getAccountDisplayName } from '@/utils/helpers';
import { Transaction, Account } from '@/types'; // Import types

interface TransactionItemProps {
    transaction: Transaction;
    accounts: Account[]; // Pass accounts to resolve names
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, accounts }) => {
    const isDeposit = transaction.type === 'deposit';
    const isWithdrawal = transaction.type === 'withdrawal';
    const isTransfer = transaction.type === 'transfer';

    const icon = isDeposit ? <TrendingUp size={20} /> :
        isWithdrawal ? <TrendingDown size={20} /> :
            <ArrowUpDown size={20} />;

    const amountColorClass = isDeposit ? 'text-green-600' :
        isWithdrawal ? 'text-red-600' :
            'text-blue-600';

    const amountSign = isDeposit ? '+' : isWithdrawal ? '-' : '';

    const fromAccount = accounts.find(acc => acc.id === transaction.fromAccount);
    const toAccount = accounts.find(acc => acc.id === transaction.toAccount);

    const fromAccountName = transaction.fromAccount ? getAccountDisplayName(fromAccount) : 'N/A';
    const toAccountName = transaction.toAccount ? getAccountDisplayName(toAccount) : 'N/A';

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDeposit ? 'bg-green-100 text-green-600' :
                        isWithdrawal ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                }`}>
                    {icon}
                </div>
                <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-600">{transaction.date}</p>
                    {isTransfer && (
                        <p className="text-xs text-gray-500">
                            From: {fromAccountName} | To: {toAccountName}
                        </p>
                    )}
                </div>
            </div>
            <div className="text-right">
                <p className={`font-semibold ${amountColorClass}`}>
                    {amountSign}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-gray-600">{transaction.status}</p>
            </div>
        </div>
    );
};

export default TransactionItem;