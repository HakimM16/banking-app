// src/app/(auth)/register/page.tsx
'use client';

import React, { ReactNode } from 'react';
import AddressForm from "@/components/forms/AddressForm";
import { useSearchParams } from 'next/navigation';

export default function RegisterPage() {
    // This page is for registering a new user and completing their address
    const searchParams = useSearchParams();
    const idFromParams = searchParams.get('id');

    // Get ID from localStorage if not in URL params
    const [id, setId] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (idFromParams) {
            // If ID exists in URL params, use it
            setId(parseInt(idFromParams, 10));
        } else {
            // Otherwise try to get it from localStorage
            const storedId = localStorage.getItem('registeredUserId');
            if (storedId) {
                setId(parseInt(storedId, 10));
                // Optional: clear it after retrieving
                // localStorage.removeItem('registeredUserId');
            }
        }
    }, [idFromParams]);

    return (
        <AddressForm id={id}/>
    );
}
