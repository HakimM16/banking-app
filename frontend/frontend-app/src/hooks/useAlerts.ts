// src/hooks/useAlerts.ts
'use client';

import { useState, useCallback } from 'react';
import { AlertState } from '@/types'; // Import type

interface UseAlertsReturn {
    alerts: AlertState[];
    addAlert: (message: string, type?: AlertState['type'], duration?: number) => void;
}

export const useAlerts = (): UseAlertsReturn => {
    const [alerts, setAlerts] = useState<AlertState[]>([]);

    const addAlert = useCallback((message: string, type: AlertState['type'] = 'info', duration: number = 5000) => {
        const newAlert: AlertState = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toISOString()
        };
        setAlerts(prev => [...prev, newAlert]);

        setTimeout(() => {
            setAlerts(prev => prev.filter(a => a.id !== newAlert.id));
        }, duration);
    }, []);

    return { alerts, addAlert };
};