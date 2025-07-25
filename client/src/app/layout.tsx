// src/app/layout.tsx
import '@/styles/globals.css'; // Global styles for Tailwind CSS
import type { Metadata } from 'next'; // Import Metadata type
import { ClientAuthProvider } from '@/providers/ClientAuthProvider';



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
                <link
                    href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
                    rel="stylesheet"/>
            </head>
            <body>
            <ClientAuthProvider>
                {children}
            </ClientAuthProvider>
            </body>
        </html>
    );
}
