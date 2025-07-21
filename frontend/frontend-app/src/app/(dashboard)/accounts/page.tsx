// src/app/(dashboard)/accounts/page.tsx
'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useAccounts } from '@/providers/AccountProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useAlerts } from '@/hooks/useAlerts';
import AccountCard from '@/components/AccountCard';
import {UpdateAccountStatusFormInputs} from "@/types";

export default function AccountsPage() {
    const { currentUser } = useAuth();
    const { accounts, createAccount, toggleAccountStatus, changeAccountStatus } = useAccounts();
    const { addAlert } = useAlerts();
    const [id, setId] = React.useState<number | null>(null);

    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [accountForm, setAccountForm] = useState({
        accountType: 'DEBIT', // Default to Debit
    });

    const [accountStatus, setAccountStatus] = useState<UpdateAccountStatusFormInputs>({
        status: 'OPEN', // Default to OPEN
    });

    // Get id from localStorage if not in URL params
    const storedId = localStorage.getItem('id');
    React.useEffect(() => {
        if (storedId) {
            setId(parseInt(storedId, 10));
        }
    }, [storedId]);

    const handleCreateAccount = async () => {
        if (id) {
            const result = await createAccount(id, accountForm);
            console.log(accountForm)
            if (result.success) {
                addAlert(result.message || 'Failed to create account.', 'error');
            }
        }

    };

    const handleToggleStatus = async (accountId: number) => {
        if (accountStatus.status === 'OPEN') {
            setAccountStatus({ status: 'CLOSED' });
        } else {
            setAccountStatus({ status: 'OPEN' });
        }

        if (id) {
            const result = await changeAccountStatus(id, accountId, accountStatus);
            if (result.success) {
                addAlert('Account status updated successfully!', 'success');
            } else {
                addAlert(result.message || 'Failed to update account status.', 'error');
            }
        }
    };

    if (!currentUser) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-50 mb-2">Accounts</h1>
                    <p className="text-gray-200">Manage your bank accounts</p>
                </div>
                <button
                    onClick={() => setIsCreatingAccount(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Create Account
                </button>
            </div>

            {isCreatingAccount && (
                <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                    <h3 className="text-lg font-semibold mb-4">Create New Account</h3>
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                        <div>
                            <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                            <select
                                id="accountType"
                                value={accountForm.accountType}
                                onChange={(e) => setAccountForm({...accountForm, accountType: e.target.value.toUpperCase()})}
                                className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="DEBIT">Debit</option>
                                <option value="SAVINGS">Savings</option>
                                <option value="CREDIT">Credit</option>
                            </select>
                        </div>
                        <button
                            onClick={handleCreateAccount}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Confirm Create
                        </button>
                        <button
                            onClick={() => setIsCreatingAccount(false)}
                            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors flex items-center gap-2"
                        >
                            <Minus size={20} />
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.length > 0 ? (
                    accounts.map((account) => (
                        <div key={account.id} className="bg-white p-6 rounded-xl shadow-md">
                            <AccountCard account={account} />
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => handleToggleStatus(account.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        account.status === 'OPEN'
                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                                >
                                    {account.status === 'OPEN' ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full">No accounts found. Create one to get started!</p>
                )}
            </div>
        </div>
    );
}