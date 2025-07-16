// src/app/(dashboard)/layout.tsx
'use client';

import { AuthProvider, useAuth } from '@/providers/AuthProvider';
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
    const router = useRouter();

    // Client-side redirection if user is not logged in
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (!storedUser) {
            router.replace('/login');
        }
    }, [router]);


    return (
        <AuthProvider>
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
        </AuthProvider>
    );
}