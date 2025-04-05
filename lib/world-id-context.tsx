'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MiniKit, MiniAppWalletAuthSuccessPayload } from '@worldcoin/minikit-js';
import { useRouter } from 'next/navigation';

type WorldIDContextType = {
    isWorldIDVerified: boolean;
    isVerifying: boolean;
    worldWalletAddress: string | null;
    verifyWithWorldID: () => Promise<void>;
    isMiniKitInstalled: boolean;
};

const WorldIDContext = createContext<WorldIDContextType | undefined>(undefined);

// Define the MiniKit interface for window
declare global {
    interface Window {
        MiniKit?: typeof MiniKit;
    }
}

export function WorldIDProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [isWorldIDVerified, setIsWorldIDVerified] = useState<boolean>(false);
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [worldWalletAddress, setWorldWalletAddress] = useState<string | null>(null);
    const [isMiniKitInstalled, setIsMiniKitInstalled] = useState<boolean>(false);

    // Check if MiniKit is installed
    useEffect(() => {
        const checkMiniKit = () => {
            const isInstalled = MiniKit.isInstalled();
            console.log('MiniKit installed (from context):', isInstalled);
            setIsMiniKitInstalled(isInstalled);
        };
        
        // Check initially
        checkMiniKit();
        
        // Check again after a short delay to ensure MiniKit has time to initialize
        const timer = setTimeout(checkMiniKit, 1000);
        
        return () => clearTimeout(timer);
    }, []);

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
    const signInWithWallet = async () => {
        // Make sure MiniKit is installed before proceeding
        if (!MiniKit.isInstalled()) {
            alert('World app is not installed! Please install the World app to verify.');
            return;
        }
        
        try {
            setIsVerifying(true);
            
            const res = await fetch(`/api/nonce`);
            const { nonce } = await res.json();
            
            console.log('Starting wallet auth with nonce:', nonce);

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
            
            const response = await fetch('/api/complete-siwe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payload: finalPayload,
                    nonce,
                }),
            });
            
            const result = await response.json();
            console.log('Verification result:', result);
            
            if (result.isValid) {
                // Now we can access the wallet address
                if (MiniKit.walletAddress) {
                    setWorldWalletAddress(MiniKit.walletAddress);
                    localStorage.setItem('worldWalletAddress', MiniKit.walletAddress);
                    console.log('Saved wallet address:', MiniKit.walletAddress);
                } else if ((finalPayload as MiniAppWalletAuthSuccessPayload).address) {
                    const address = (finalPayload as MiniAppWalletAuthSuccessPayload).address;
                    setWorldWalletAddress(address);
                    localStorage.setItem('worldWalletAddress', address);
                    console.log('Saved wallet address from payload:', address);
                }
                
                setIsWorldIDVerified(true);
                localStorage.setItem('worldIDVerified', 'true');
                
                // If you need the username
                if (MiniKit.user && MiniKit.user.username) {
                    localStorage.setItem('worldUsername', MiniKit.user.username);
                    console.log('Saved username:', MiniKit.user.username);
                }
                
                // Redirect to soldier-prep page after successful verification
                console.log('Redirecting to soldier-prep page after World ID verification');
                setTimeout(() => {
                    router.push('/soldier-prep?auth=world');
                }, 500); // Short delay to ensure state is updated
                
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

    // Use the signInWithWallet function for verifyWithWorldID to match documentation
    const verifyWithWorldID = signInWithWallet;

    return (
        <WorldIDContext.Provider
            value={{
                isWorldIDVerified,
                isVerifying,
                worldWalletAddress,
                verifyWithWorldID,
                isMiniKitInstalled,
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
