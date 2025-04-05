import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextAuthProvider from '@/components/next-auth-provider';
import { WalletProvider } from '@/lib/wallet-context';
import { WorldIDProvider } from '@/lib/world-id-context';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'MemeWarriors - Pixel Battlefield',
    description: 'Create AI Meme Soldiers & Battle in the Pixel Arena!',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <NextAuthProvider>
                    <WalletProvider>
                        <WorldIDProvider>
                            <Navbar />
                            {children}
                        </WorldIDProvider>
                    </WalletProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}
