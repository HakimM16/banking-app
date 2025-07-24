// src/components/TransactionItem.tsx
import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { formatCurrency, getAccountDisplayName } from '@/utils/helpers';
import { Transaction, Account } from '@/types'; // Import types

interface TransactionItemProps {
    transaction: Transaction;
    accounts: Account[];
    transactions: Transaction[]; // Add all transactions as a prop
}

// TransactionItem component displays a single transaction with details and styling based on type
const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, accounts, transactions }) => {
    // Determine transaction type
    const isDeposit = transaction.transactionType === 'DEPOSIT';
    const isWithdrawal = transaction.transactionType === 'WITHDRAWAL';
    const isTransfer = transaction.transactionType === 'TRANSFER';

    // Select icon based on transaction type
    const icon = isDeposit ? <TrendingUp size={20} /> :
        isWithdrawal ? <TrendingDown size={20} /> :
            <ArrowUpDown size={20} />;

    // Set color class for amount based on transaction type
    const amountColorClass = isDeposit ? 'text-green-600' :
        isWithdrawal ? 'text-red-600' :
            'text-blue-600';

    // Set sign for amount display
    const amountSign = isDeposit ? '+' : isWithdrawal ? '-' : '';

    // For transfers, find the matching transaction with the same code
    const matchingTransaction = isTransfer && transaction.code ?
        transactions.find(t =>
            t.id !== transaction.id &&
            t.code === transaction.code &&
            t.transactionType === 'TRANSFER'
        ) : undefined;

    return (
        <div className="flex items-center justify-between p-4 bg-indigo-100 rounded-lg">
            <div className="flex items-center gap-3">
                {/* Icon with background color based on transaction type */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDeposit ? 'bg-green-100 text-green-600' :
                        isWithdrawal ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                }`}>
                    {icon}
                </div>
                <div>
                    {/* Transaction description */}
                    <p className="font-medium">{transaction.description}</p>
                    {/* Show transfer details or category */}
                    {transaction && matchingTransaction ? (
                        <p className="text-xs text-gray-500">
                            From: {"*".repeat(4) + (transaction.accountNumber?.slice(4) ?? "")} | To: {"*".repeat(4) + (matchingTransaction.accountNumber?.slice(4) ?? "")}
                        </p>
                    ) : (
                        <p className="text-xs text-gray-500">
                            Category: {transaction.categoryName || 'N/A'}
                        </p>
                    )}
                </div>
            </div>
            <div className="text-right pl-10">
                {/* Amount with color and sign */}
                <p className={`font-semibold ${amountColorClass}`}>
                    {amountSign}{formatCurrency(transaction.amount)}
                </p>
                {/* Optionally show transaction status */}
                {/*<p className="text-sm text-gray-600">{transaction.status}</p>*/}
            </div>
        </div>
    );
};

export default TransactionItem;