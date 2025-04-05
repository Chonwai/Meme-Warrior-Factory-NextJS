'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

type WorldIDContextType = {
    isWorldIDVerified: boolean;
    isVerifying: boolean;
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

    // Check if verification status exists in local storage on component mount
    useEffect(() => {
        const storedVerification = localStorage.getItem('worldIDVerified');
        if (storedVerification === 'true') {
            setIsWorldIDVerified(true);
        }
    }, []);

    // Function to verify with World ID
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

            // Call World ID verification
            const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
                nonce: nonce,
                expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                statement: 'Verify with World ID to access MemeWarriors',
            });

            if (finalPayload.status === 'error') {
                console.error('World ID verification failed:', finalPayload);
                return;
            }

            // Verify the response from World App in our backend
            const response = await fetch('/api/verify-world-id', {
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

            if (result.isValid) {
                setIsWorldIDVerified(true);
                localStorage.setItem('worldIDVerified', 'true');
            } else {
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
