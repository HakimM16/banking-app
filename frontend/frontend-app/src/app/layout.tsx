// src/app/layout.tsx
import './globals.css'; // Global styles for Tailwind CSS
import type { Metadata } from 'next'; // Import Metadata type

export const metadata: Metadata = {
    title: 'SecureBank',
    description: 'Your secure online banking platform',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}