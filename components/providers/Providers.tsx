'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { TRPCProvider } from './TRPCProvider';
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from '../ui/sonner';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TRPCProvider>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </TRPCProvider>
    </ThemeProvider>
  );
}
