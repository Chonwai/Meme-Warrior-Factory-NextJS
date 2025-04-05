'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type WalletContextType = {
    isConnected: boolean;
    walletAddress: string | null;
    balance: number;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    // 預設為已連接狀態，這樣就不需要點擊連接按鈕
    const [isConnected, setIsConnected] = useState<boolean>(true);
    const [walletAddress, setWalletAddress] = useState<string | null>('0x1234...5678');
    const [balance, setBalance] = useState<number>(10.5);

    // 模擬錢包連接功能
    const connectWallet = async (): Promise<void> => {
        // 在真實項目中，這裡應該調用MetaMask或其他錢包提供商的API
        // 目前是硬編碼模擬
        setTimeout(() => {
            setIsConnected(true);
            setWalletAddress('0x1234...5678');
            setBalance(10.5); // 模擬10.5 CELO
        }, 1000);
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
