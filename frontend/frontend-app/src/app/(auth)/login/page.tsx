// src/app/(auth)/login/page.tsx
'use client';
import LoginForm from '@/components/forms/LoginForm';
import { useAlerts } from '@/hooks/useAlerts';
import Alert from '@/components/ui/Alert';
import React, { ReactNode } from 'react';

// A simple AlertProvider for demonstration within a page
const PageAlertProvider = ({ children }: { children: ReactNode }) => {
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

export default function LoginPage() {
    return (
        <PageAlertProvider>
            <LoginForm />
        </PageAlertProvider>
    );
}

