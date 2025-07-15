// src/components/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, CreditCard, ArrowUpDown, History, Settings, LogOut, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const { currentUser, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="w-64 bg-gray-900 text-white h-full flex flex-col">
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">SecureBank</h2>
                        <p className="text-sm text-gray-300">Welcome, {currentUser?.firstName}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <div className="space-y-2">
                    <Link href="/home" passHref>
                        <button
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                pathname === '/home' ? 'bg-blue-600' : 'hover:bg-gray-800'
                            }`}
                        >
                            <TrendingUp size={20} />
                            Dashboard
                        </button>
                    </Link>

                    <Link href="/accounts" passHref>
                        <button
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                pathname === '/accounts' ? 'bg-blue-600' : 'hover:bg-gray-800'
                            }`}
                        >
                            <CreditCard size={20} />
                            Accounts
                        </button>
                    </Link>

                    <Link href="/transactions" passHref>
                        <button
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                pathname === '/transactions' ? 'bg-blue-600' : 'hover:bg-gray-800'
                            }`}
                        >
                            <ArrowUpDown size={20} />
                            Transactions
                        </button>
                    </Link>

                    <Link href="/history" passHref>
                        <button
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                pathname === '/history' ? 'bg-blue-600' : 'hover:bg-gray-800'
                            }`}
                        >
                            <History size={20} />
                            Transaction History
                        </button>
                    </Link>

                    <Link href="/profile" passHref>
                        <button
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                pathname === '/profile' ? 'bg-blue-600' : 'hover:bg-gray-800'
                            }`}
                        >
                            <User size={20} />
                            Profile
                        </button>
                    </Link>
                </div>
            </nav>

            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={() => {
                        handleLogout();
                        window.location.href = '/login';
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-red-400"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;