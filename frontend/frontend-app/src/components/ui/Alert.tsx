// src/components/ui/Alert.tsx
'use client';

import React, {JSX} from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { AlertState } from '@/types'; // Import type

interface AlertProps {
    alert: AlertState;
}

const Alert: React.FC<AlertProps> = ({ alert }) => {
    if (!alert) return null;

    const getBackgroundColor = (type: AlertState['type']): string => {
        switch (type) {
            case 'success': return 'bg-green-500';
            case 'error': return 'bg-red-500';
            case 'warning': return 'bg-yellow-500';
            default: return 'bg-blue-500';
        }
    };

    const getIcon = (type: AlertState['type']): JSX.Element => {
        switch (type) {
            case 'success': return <CheckCircle size={20} />;
            case 'error': return <AlertCircle size={20} />;
            case 'warning': return <AlertCircle size={20} />;
            default: return <AlertCircle size={20} />;
        }
    };

    return (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm text-white ${getBackgroundColor(alert.type)}`}>
            <div className="flex items-center gap-2">
                {getIcon(alert.type)}
                <span>{alert.message}</span>
            </div>
        </div>
    );
};

export default Alert;