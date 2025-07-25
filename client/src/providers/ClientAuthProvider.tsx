'use client';

import { AuthProvider } from '@/providers/AuthProvider';

export const ClientAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
