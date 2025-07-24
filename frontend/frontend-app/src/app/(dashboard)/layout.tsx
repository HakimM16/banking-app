// src/app/(dashboard)/layout.tsx
'use client';

import '@/styles/menu.css';
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const screenWidth: number = window.innerWidth;
    const isMobile = screenWidth < 768; // Adjust breakpoint as needed

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
                    { isMobile ? (
                        <div className="relative h-screen bg-indigo-900">
                            {/* Mobile hamburger menu - keeping it visible at all times */}
                            <button
                                className="fixed top-0 right-0 z-50 text-white p-4 m-2 rounded-md md:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <div id="toggleButton"
                                     className="toggle relative w-10 h-10 cursor-pointer flex flex-col items-center justify-center gap-2.5 transition-all duration-500">
                                    <div className="bars w-full h-1 bg-stone-50 rounded"></div>
                                    <div className="bars w-full h-1 bg-stone-50 rounded transition-all duration-500"
                                         id="bar2"></div>
                                    <div className="bars w-full h-1 bg-stone-50 rounded"></div>
                                </div>
                            </button>

                            {/* Fullscreen Sidebar */}
                            <div
                                className={`fixed top-0 left-0 w-screen h-screen z-40 ${mobileMenuOpen ? 'block' : 'hidden md:block md:w-auto md:h-full'}`}>
                                <Sidebar/>
                            </div>

                            <main className={`w-full h-full overflow-y-auto ${mobileMenuOpen ? 'hidden md:block md:ml-64' : 'block'} pt-5`}>
                                {children}
                            </main>
                        </div>
                    ) : (
                        <div className="flex h-screen bg-indigo-900">
                            <Sidebar />
                            <main className="flex-1 overflow-y-auto">
                                {children}
                            </main>
                        </div>
                    )}

                </AlertProvider>
            </TransactionProvider>
        </AccountProvider>
    );
}