'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MiniKit, MiniAppWalletAuthSuccessPayload } from '@worldcoin/minikit-js';

type WorldIDContextType = {
    isWorldIDVerified: boolean;
    isVerifying: boolean;
    worldWalletAddress: string | null;
    verifyWithWorldID: () => Promise<void>;
};

const WorldIDContext = createContext<WorldIDContextType | undefined>(undefined);

// Define the MiniKit interface for window
declare global {
    interface Window {
        MiniKit?: typeof MiniKit;
    }
}

export function WorldIDProvider({ children }: { children: ReactNode }) {
    const [isWorldIDVerified, setIsWorldIDVerified] = useState<boolean>(false);
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [worldWalletAddress, setWorldWalletAddress] = useState<string | null>(null);

    // Check if verification status exists in local storage on component mount
    useEffect(() => {
        const storedVerification = localStorage.getItem('worldIDVerified');
        const storedAddress = localStorage.getItem('worldWalletAddress');
        
        if (storedVerification === 'true') {
            setIsWorldIDVerified(true);
        }
        
        if (storedAddress) {
            setWorldWalletAddress(storedAddress);
        }
    }, []);

    // Implementation of Sign In With Ethereum (SIWE) using World ID
    const verifyWithWorldID = async (): Promise<void> => {
        // Check if World app is installed
        if (!MiniKit.isInstalled()) {
            alert('World app is not installed! Please install the World app to verify.');
            return;
        }

        try {
            setIsVerifying(true);
            
            // Get a nonce from our backend
            const res = await fetch(`/api/nonce`);
            const { nonce } = await res.json();

            console.log('Starting wallet auth with nonce:', nonce);
            
            // Call World ID verification using the walletAuth command with proper payload handling
            const { commandPayload: generateMessageResult, finalPayload } = await MiniKit.commandsAsync.walletAuth({
                nonce: nonce,
                requestId: '0', // Optional
                expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
                statement: 'Sign in to MemeWarriors with your World ID',
            });

            console.log('Received wallet auth response:', finalPayload);
            
            if (finalPayload.status === 'error') {
                console.error('World ID verification failed:', finalPayload);
                return;
            }

            // Verify the response from World App in our backend
            const response = await fetch('/api/complete-siwe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payload: finalPayload as MiniAppWalletAuthSuccessPayload,
                    nonce,
                }),
            });

            const result = await response.json();
            console.log('Verification result:', result);
            
            if (result.isValid) {
                // Get wallet address from MiniKit object if available
                const walletAddress = MiniKit.walletAddress || (finalPayload as MiniAppWalletAuthSuccessPayload).address;
                
                if (walletAddress) {
                    setWorldWalletAddress(walletAddress);
                    localStorage.setItem('worldWalletAddress', walletAddress);
                    console.log('Saved wallet address:', walletAddress);
                }
                
                setIsWorldIDVerified(true);
                localStorage.setItem('worldIDVerified', 'true');
                
                // If you need the username as mentioned in docs
                if (MiniKit.user && MiniKit.user.username) {
                    localStorage.setItem('worldUsername', MiniKit.user.username);
                    console.log('Saved username:', MiniKit.user.username);
                }
            } else {
                console.error('Verification failed:', result);
                alert('World ID verification failed. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying with World ID:', error);
            alert('Failed to verify with World ID. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <WorldIDContext.Provider
            value={{
                isWorldIDVerified,
                isVerifying,
                worldWalletAddress,
                verifyWithWorldID,
            }}
        >
            {children}
        </WorldIDContext.Provider>
    );
}

export function useWorldID() {
    const context = useContext(WorldIDContext);
    if (context === undefined) {
        throw new Error('useWorldID must be used within a WorldIDProvider');
    }
    return context;
}
