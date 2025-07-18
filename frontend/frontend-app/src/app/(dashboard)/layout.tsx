// src/app/(dashboard)/layout.tsx
'use client';

import { useAuth } from '@/providers/AuthProvider';
import { AccountProvider } from '@/providers/AccountProvider';
import { TransactionProvider } from '@/providers/TransactionProvider';
import { useAlerts } from '@/hooks/useAlerts';
import Alert from '@/components/ui/Alert';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

// Centralized AlertProvider for the (dashboard) layout
const AlertProvider = ({ children }: { children: ReactNode }) => {
    const { alerts } = useAlerts();
    return (
        <>
            {children}
            {alerts.map((alert) => (
                <Alert key={alert.id} alert={alert} />
            ))}
        </>
    );
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { isAuthenticated, loading, currentUser } = useAuth();
    const router = useRouter();

    console.log('Dashboard Layout - isAuthenticated:', isAuthenticated, 'loading:', loading, 'currentUser:', currentUser);

    useEffect(() => {
        console.log('Dashboard useEffect - isAuthenticated:', isAuthenticated, 'loading:', loading);
        if (!loading && !isAuthenticated) {
            console.log('Redirecting to login');
            router.replace('/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        console.log('Dashboard showing loading screen');
        return (
            <div className="flex h-screen items-center justify-center bg-indigo-900">
                <div className="text-white text-xl">Checking authentication...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.log('Dashboard showing not authenticated screen');
        return (
            <div className="flex h-screen items-center justify-center bg-indigo-900">
                <div className="text-white text-xl">Not authenticated, redirecting...</div>
            </div>
        );
    }

    console.log('Dashboard showing authenticated content');
    return (
        <AccountProvider>
            <TransactionProvider>
                <AlertProvider>
                    <div className="flex h-screen bg-indigo-900">
                        <Sidebar />
                        <main className="flex-1 overflow-y-auto">
                            {children}
                        </main>
                    </div>
                </AlertProvider>
            </TransactionProvider>
        </AccountProvider>
    );
}

