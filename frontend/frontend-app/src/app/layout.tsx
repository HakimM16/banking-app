// src/app/layout.tsx
import '@/styles/globals.css' // Global styles for Tailwind CSS
import type { Metadata } from 'next'; // Import Metadata type

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
        <body>{children}</body>
        </html>
    );
}