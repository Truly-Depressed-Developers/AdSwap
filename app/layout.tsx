import type { Metadata } from 'next';
import { Geist, Geist_Mono, Roboto } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { NavbarProvider } from '@/hooks/useNavbar';
import { LayoutInner } from './layoutInner';

const roboto = Roboto({ subsets: ['latin'], variable: '--font-sans', weight: ['400', '500', '700'] });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bitehack 2026',
  description: 'Bitehack 2026',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <LayoutInner>
            {children}
          </LayoutInner>
        </Providers>
      </body>
    </html>
  );
}
