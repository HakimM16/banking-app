// src/app/layout.tsx
import '@/styles/globals.css'; // Global styles for Tailwind CSS
import type { Metadata } from 'next'; // Import Metadata type
import { ClientAuthProvider } from '@/providers/ClientAuthProvider';

export const metadata: Metadata = {
    title: 'Vesta',
    description: 'Your secure online banking platform',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <ClientAuthProvider>
                    {children}
                </ClientAuthProvider>
            </body>
        </html>
    );
}
