// src/app/(dashboard)/layout.tsx
'use client';

import { useAuth } from '@/providers/AuthProvider';
import { AccountProvider } from '@/providers/AccountProvider';
import { TransactionProvider } from '@/providers/TransactionProvider';
import { useAlerts } from '@/hooks/useAlerts';
import Alert from '@/components/ui/Alert';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';

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
    const { isAuthenticated, loading, currentUser, isTokenValid } = useAuth();
    const router = useRouter();
    const [showSessionExpired, setShowSessionExpired] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const isTokenStillValid = isTokenValid();
            console.log('Checking if token is still valid:', isTokenStillValid, ' Time:', timer, 's');
            if (!isTokenStillValid) {
                console.log('Redirecting to login');
                setShowSessionExpired(true);
                setTimeout(() => {
                    router.replace('/login');
                }, 1500); // Show message for 1.5 seconds before redirect
            }
            setTimer(prevTimer => prevTimer + 1);
        }, 1000); // Runs every 1 second

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [isAuthenticated, loading, router, isTokenValid, timer]);

    if (showSessionExpired) {
        return (
            <div className="flex h-screen items-center justify-center bg-indigo-900">
                <div className="text-white text-xl">Session expired, You have to re-login</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.log('Dashboard showing not authenticated screen');
        return (
            <div className="flex h-screen items-center justify-center bg-indigo-900">
                <div className="text-white text-xl">Session expired, You have to re-login</div>
            </div>
        );
    }
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