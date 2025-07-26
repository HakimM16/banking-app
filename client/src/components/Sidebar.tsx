// src/components/Sidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, CreditCard, ArrowUpDown, History, Settings, LogOut, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import LogoForSidebar from "@/components/ui/LogoForSidebar";
import {jwtDecode} from "jwt-decode";

const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const { currentUser, logout } = useAuth();
    const [token, setToken] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);

    // Access localStorage only on client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem('token'));
            setName(localStorage.getItem('name'));
        }
    }, []);

    // check if token is valid
    const getTokenExpiration = (token: string) => {
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            return decoded.exp ? new Date(decoded.exp * 1000) : null;
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    }

    const timeRemaining = (token: string) => {
        const expirationDate = getTokenExpiration(token || '');
        if (!expirationDate) return null;
        const now = new Date();
        const timeLeft = expirationDate.getTime() - now.getTime();
        return timeLeft > 0 ? Math.ceil(timeLeft / 1000) : 0; // Return time left in seconds
    }

    const handleLogout = () => {
        logout();
        // Clear localStorage
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }
    };

    return (
        <div className="w-64 bg-gray-900 text-white h-full flex flex-col">
            <div className="p-6 border-b border-gray-50">
                <div className="flex items-center gap-3">
                    <LogoForSidebar />
                    <div>
                        <h2 className="text-xl font-bold">Vesta</h2>
                        <p className="text-sm text-gray-300">Welcome, {name || "User"}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <div className="space-y-2 ">
                    <Link href="/home" passHref>
                        <button
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                                pathname === '/home' ? 'bg-indigo-700' : 'hover:bg-slate-800'
                            }`}
                        >
                            <TrendingUp size={20} />
                            Dashboard
                        </button>
                    </Link>

                    <Link href="/accounts" passHref>
                        <button
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                                pathname === '/accounts' ? 'bg-indigo-700' : 'hover:bg-slate-800'
                            }`}
                        >
                            <CreditCard size={20} />
                            Accounts
                        </button>
                    </Link>

                    <Link href="/transactions" passHref>
                        <button
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                                pathname === '/transactions' ? 'bg-indigo-700' : 'hover:bg-slate-800'
                            }`}
                        >
                            <ArrowUpDown size={20} />
                            Transactions
                        </button>
                    </Link>

                    <Link href="/history" passHref>
                        <button
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                                pathname === '/history' ? 'bg-indigo-700' : 'hover:bg-slate-800'
                            }`}
                        >
                            <History size={20} />
                            Transaction History
                        </button>
                    </Link>

                    <Link href="/profile" passHref>
                        <button
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                                pathname === '/profile' ? 'bg-indigo-700' : 'hover:bg-slate-800'
                            }`}
                        >
                            <User size={20} />
                            Profile
                        </button>
                    </Link>
                </div>
            </nav>

            <div className="p-4 border-t border-gray-50">
                <button
                    onClick={() => {
                        handleLogout();
                        window.location.href = '/login';
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-600 transition-colors text-red-400
                    cursor-pointer"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;