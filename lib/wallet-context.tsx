'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type WalletContextType = {
    isConnected: boolean;
    walletAddress: string | null;
    balance: number;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Define the window ethereum interface
declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: any[] }) => Promise<any>;
            on: (event: string, callback: (...args: any[]) => void) => void;
            removeListener: (event: string, callback: (...args: any[]) => void) => void;
            isMetaMask?: boolean;
        };
    }
}

export function WalletProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<number>(0);

    // Check if wallet is already connected on component mount
    useEffect(() => {
        const checkConnection = async () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                try {
                    // Get connected accounts
                    const accounts = await window.ethereum.request({
                        method: 'eth_accounts',
                    });
                    
                    if (accounts.length > 0) {
                        const account = accounts[0];
                        setIsConnected(true);
                        setWalletAddress(formatAddress(account));
                        await updateBalance(account);
                    }
                } catch (error) {
                    console.error("Error checking existing connection:", error);
                }
            }
        };
        
        checkConnection();
        
        // Listen for account changes
        const handleAccountsChanged = async (accounts: string[]) => {
            if (accounts.length === 0) {
                // User disconnected their wallet
                disconnectWallet();
            } else {
                setIsConnected(true);
                setWalletAddress(formatAddress(accounts[0]));
                await updateBalance(accounts[0]);
            }
        };
        
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }
        
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, []);

    // Helper function to format address for display
    const formatAddress = (address: string): string => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    // Helper function to update balance
    const updateBalance = async (address: string) => {
        try {
            if (window.ethereum) {
                const balance = await window.ethereum.request({
                    method: 'eth_getBalance',
                    params: [address, 'latest'],
                });
                
                // Convert balance from wei to ETH
                const ethBalance = parseInt(balance, 16) / 1e18;
                setBalance(parseFloat(ethBalance.toFixed(4)));
            }
        } catch (error) {
            console.error("Error getting balance:", error);
        }
    };

    // Connect to MetaMask wallet
    const connectWallet = async (): Promise<void> => {
        if (typeof window === 'undefined' || !window.ethereum) {
            alert('MetaMask is not installed! Please install MetaMask to connect your wallet.');
            return;
        }
        
        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });
            
            if (accounts.length > 0) {
                const account = accounts[0];
                setIsConnected(true);
                setWalletAddress(formatAddress(account));
                await updateBalance(account);
            }
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert('Failed to connect to MetaMask. Please try again.');
        }
    };

    const disconnectWallet = () => {
        setIsConnected(false);
        setWalletAddress(null);
        setBalance(0);
    };

    return (
        <WalletContext.Provider
            value={{
                isConnected,
                walletAddress,
                balance,
                connectWallet,
                disconnectWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}
