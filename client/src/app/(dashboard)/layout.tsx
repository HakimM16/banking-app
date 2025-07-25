// src/app/(dashboard)/layout.tsx
'use client';

import '@/styles/menu.css';
import { useAuth } from '@/providers/AuthProvider';
import { AccountProvider } from '@/providers/AccountProvider';
import { TransactionProvider } from '@/providers/TransactionProvider';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { isAuthenticated, loading, currentUser, isTokenValid } = useAuth();
    const router = useRouter();
    const [showSessionExpired, setShowSessionExpired] = useState(false);
    const [timer, setTimer] = useState(0);
    const [backendStatus, setBackendStatus] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Handle screen size detection
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Set initial value
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup event listener
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        // Check backend status every 10 seconds
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
            <div className="flex h-screen items-center justify-center bg-indigo-900 px-4">
                <div className="text-white text-center">
                    <div className="text-xl md:text-2xl">500: Backend service is unavailable.</div>
                    <div className="text-sm md:text-base mt-2">Please try again in a few moments.</div>
                </div>
            </div>
        );
    }

    if (showSessionExpired) {
        localStorage.clear();
        return (
            <div className="flex h-screen items-center justify-center bg-indigo-900 px-4">
                <div className="text-white text-xl md:text-2xl text-center">Session expired, You have to re-login</div>
            </div>
        );
    }

    return (
        <AccountProvider>
            <TransactionProvider>
                {isMobile ? (
                    <div className="relative h-screen bg-indigo-900 mobile-container">
                        {/* Mobile hamburger menu */}
                        <button
                            className="fixed top-4 right-4 z-50 text-white p-3 rounded-md mobile-menu-button bg-indigo-800 shadow-lg"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <div className={`toggle relative w-8 h-8 cursor-pointer flex flex-col items-center justify-center gap-1 transition-all duration-300 ${mobileMenuOpen ? 'active' : ''}`}>
                                <div className={`bars w-full h-1 bg-white rounded transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                                <div className={`bars w-5 h-1 bg-white rounded transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
                                <div className={`bars w-full h-1 bg-white rounded transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                            </div>
                        </button>

                        {/* Mobile overlay */}
                        {mobileMenuOpen && (
                            <div
                                className="fixed inset-0 z-30 mobile-overlay"
                                onClick={() => setMobileMenuOpen(false)}
                            />
                        )}

                        {/* Mobile Sidebar */}
                        <div className={`fixed top-0 left-0 w-80 h-full z-40 mobile-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
                            <Sidebar />
                        </div>

                        {/* Main content */}
                        <main className="w-full h-full overflow-y-auto mobile-main px-4">
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
            </TransactionProvider>
        </AccountProvider>
    );
}