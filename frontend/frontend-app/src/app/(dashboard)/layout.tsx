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
    const [backendStatus, setBackendStatus] = useState(true);

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

    useEffect(() => {
        // Check backend status every 2 seconds
        const interval = setInterval(() => {
            fetch('http://localhost:8080/actuator/health', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error(`HTTP ${response.status}`);
                })
                .then(data => {
                    setBackendStatus(data.status === 'UP' || data.status === 'ok');
                })
                .catch(error => {
                    console.error('Error checking backend status:', error);
                    setBackendStatus(false);
                });
        }, 10000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    if (backendStatus === false) {
        return (
            <div className="flex h-screen items-center justify-center bg-indigo-900">
                <div className="text-white text-xl"><div className="text-white text-xl">500: Backend service is unavailable. Please try again in a few moments.</div></div>
            </div>
        );
    }

    if (showSessionExpired) {
        localStorage.clear();
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