'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Image from 'next/image';

// Network type definition
type NetworkInfo = {
    chainId: string;
    chainName: string;
    icon: string;
    rpcUrls: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    blockExplorerUrls: string[];
};

// Define supported networks
const SUPPORTED_NETWORKS: Record<string, NetworkInfo> = {
    '0x221': {
        chainId: '0x221',
        chainName: 'Flow Testnet',
        icon: '/images/networks/flow.svg',
        rpcUrls: ['https://testnet.evm.nodes.onflow.org'],
        nativeCurrency: {
            name: 'Flow',
            symbol: 'FLOW',
            decimals: 18,
        },
        blockExplorerUrls: ['https://evm-testnet.flowscan.io/'],
    },
    '0xaef3': {
        chainId: '0xaef3',
        chainName: 'Celo Alfajores Testnet',
        icon: '/images/networks/celo.svg',
        rpcUrls: ['https://alfajores-forno.celo-testnet.org', 'https://alfajores-forno.celo.org'],
        nativeCurrency: {
            name: 'CELO',
            symbol: 'CELO',
            decimals: 18,
        },
        blockExplorerUrls: ['https://alfajores.celoscan.io', 'https://explorer.celo.org/alfajores'],
    },
    '0xa4ec': {
        chainId: '0xa4ec',
        chainName: 'Celo',
        icon: '/images/networks/celo.svg',
        rpcUrls: ['https://forno.celo.org'],
        nativeCurrency: {
            name: 'CELO',
            symbol: 'CELO',
            decimals: 18,
        },
        blockExplorerUrls: ['https://explorer.celo.org/'],
    },
    '0x3a44': {
        chainId: '0x3a44',
        chainName: 'World Chain',
        icon: '/images/networks/celo.svg',
        rpcUrls: ['https://mainnet.worldchain.network'],
        nativeCurrency: {
            name: 'World Chain',
            symbol: 'WO',
            decimals: 18,
        },
        blockExplorerUrls: ['https://explorer.worldchain.network'],
    },
};

type WalletContextType = {
    isConnected: boolean;
    walletAddress: string | null;
    balance: number;
    networkInfo: NetworkInfo | null;
    showNetworkModal: boolean;
    setShowNetworkModal: (show: boolean) => void;
    connectWallet: () => Promise<void>;
    switchNetwork: (chainId: string) => Promise<void>;
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
    // METAMASK IMPLEMENTATION
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<number>(0);
    const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
    const [pendingAccounts, setPendingAccounts] = useState<string[]>([]);
    const [showNetworkModal, setShowNetworkModal] = useState<boolean>(false);

    // SIMULATION CODE (COMMENTED OUT)
    // // 預設為已連接狀態，這樣就不需要點擊連接按鈕
    // const [isConnected, setIsConnected] = useState<boolean>(true);
    // const [walletAddress, setWalletAddress] = useState<string | null>('0x1234...5678');
    // const [balance, setBalance] = useState<number>(10.5);

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
                    console.error('Error checking existing connection:', error);
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
            console.error('Error getting balance:', error);
        }
    };

    // Get current network
    const getCurrentNetwork = async () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                console.log(`Current chainId: ${chainId}`);

                // Find the network info
                const currentNetwork = SUPPORTED_NETWORKS[chainId];
                if (currentNetwork) {
                    setNetworkInfo(currentNetwork);
                    return currentNetwork;
                } else {
                    console.warn(`Connected to unsupported network with chainId: ${chainId}`);
                    return null;
                }
            } catch (error) {
                console.error('Error getting current network:', error);
                return null;
            }
        }
        return null;
    };

    // Switch to a network
    const switchNetwork = async (chainId: string): Promise<void> => {
        if (typeof window === 'undefined' || !window.ethereum) {
            alert('MetaMask is not installed!');
            return;
        }

        const networkConfig = SUPPORTED_NETWORKS[chainId];
        if (!networkConfig) {
            alert('Unsupported network');
            return;
        }

        try {
            // First try to switch to the network
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            });

            // Update network info if successful
            setNetworkInfo(networkConfig);
            console.log(`Successfully switched to ${networkConfig.chainName}`);
        } catch (switchError: any) {
            console.error('Error switching network:', switchError);

            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                    console.log(`Network not in MetaMask, adding ${networkConfig.chainName}`);

                    // Add the network
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId,
                                chainName: networkConfig.chainName,
                                nativeCurrency: networkConfig.nativeCurrency,
                                rpcUrls: networkConfig.rpcUrls,
                                blockExplorerUrls: networkConfig.blockExplorerUrls,
                            },
                        ],
                    });

                    // Try switching again after adding
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId }],
                    });

                    // Update network info if successful
                    setNetworkInfo(networkConfig);
                    console.log(`Successfully switched to ${networkConfig.chainName} after adding`);
                } catch (addError: any) {
                    console.error('Error adding network:', addError);
                    alert(`Failed to add network: ${addError.message || 'Unknown error'}`);
                }
            } else {
                alert(`Failed to switch network: ${switchError.message || 'Unknown error'}`);
            }
        }
    };

    // Finalize connection after network selection
    const finalizeConnection = async (accounts: string[], selectedNetwork: string) => {
        try {
            // Switch to the selected network
            await switchNetwork(selectedNetwork);

            // Complete the connection
            const account = accounts[0];
            setIsConnected(true);
            setWalletAddress(formatAddress(account));
            await updateBalance(account);
            setPendingAccounts([]);

            // Hide the network modal
            setShowNetworkModal(false);
        } catch (error) {
            console.error('Error finalizing connection:', error);
            alert('Failed to complete connection. Please try again.');
            setPendingAccounts([]);
        }
    };

    // Connect to MetaMask wallet
    const connectWallet = async (): Promise<void> => {
        // METAMASK IMPLEMENTATION
        if (typeof window === 'undefined' || !window.ethereum) {
            alert('MetaMask is not installed! Please install MetaMask to connect your wallet.');
            return;
        }

        try {
            console.log('Requesting accounts from MetaMask...');

            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            if (accounts.length > 0) {
                console.log(`Accounts received: ${accounts[0]}`);

                // Store the accounts but don't complete connection yet
                setPendingAccounts(accounts);

                // Show network selection modal
                setShowNetworkModal(true);
            } else {
                console.error('No accounts returned from MetaMask');
                alert(
                    'No accounts found. Please make sure you have at least one account in MetaMask.'
                );
            }
        } catch (error: any) {
            console.error('Error connecting wallet:', error);

            // Provide more detailed error messages based on common MetaMask errors
            if (error.code === 4001) {
                // User rejected the request
                alert(
                    'You rejected the connection request. Please approve the MetaMask connection to continue.'
                );
            } else if (error.code === -32002) {
                // Request already pending
                alert(
                    'A connection request is already pending in MetaMask. Please check your MetaMask extension.'
                );
            } else {
                alert(`Failed to connect to MetaMask: ${error.message || 'Unknown error'}`);
            }
        }
    };

    // Disconnect wallet
    const disconnectWallet = () => {
        setIsConnected(false);
        setWalletAddress(null);
        setBalance(0);
        setNetworkInfo(null);
    };

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
                        await getCurrentNetwork();
                    }
                } catch (error) {
                    console.error('Error checking existing connection:', error);
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

        // Listen for network changes
        const handleChainChanged = async (chainId: string) => {
            console.log(`Chain changed to: ${chainId}`);

            // Find the network info
            const newNetwork = SUPPORTED_NETWORKS[chainId];
            if (newNetwork) {
                setNetworkInfo(newNetwork);
            } else {
                setNetworkInfo(null);
                console.warn(`Switched to unsupported network with chainId: ${chainId}`);
            }

            // Update balance for the current account
            if (isConnected && walletAddress && window.ethereum) {
                // Extract the original address from the formatted one
                const originalAddress = await window.ethereum.request({
                    method: 'eth_accounts',
                });

                if (originalAddress.length > 0) {
                    await updateBalance(originalAddress[0]);
                }
            }
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [isConnected, walletAddress]);

    return (
        <WalletContext.Provider
            value={{
                isConnected,
                walletAddress,
                balance,
                networkInfo,
                showNetworkModal,
                setShowNetworkModal,
                connectWallet,
                switchNetwork,
                disconnectWallet,
            }}
        >
            {children}
            {showNetworkModal && pendingAccounts.length > 0 && (
                <NetworkSelectionModal
                    pendingAccounts={pendingAccounts}
                    onSelect={finalizeConnection}
                    onCancel={() => {
                        setPendingAccounts([]);
                        setShowNetworkModal(false);
                    }}
                />
            )}
        </WalletContext.Provider>
    );
}

// Network Selection Modal Component (internal to this file)
function NetworkSelectionModal({
    pendingAccounts,
    onSelect,
    onCancel,
}: {
    pendingAccounts: string[];
    onSelect: (accounts: string[], network: string) => Promise<void>;
    onCancel: () => void;
}) {
    const [selectedNetwork, setSelectedNetwork] = useState<string>('0xaef3'); // Default to Celo
    const [isLoading, setIsLoading] = useState(false);
    const [showWorldError, setShowWorldError] = useState(false);

    // Available networks
    const networks = [
        {
            chainId: '42220',
            name: 'Celo',
            icon: '/images/networks/celo.svg',
            description: 'Celo Mainnet - EVM compatible blockchain',
        },
        {
            chainId: '0xaef3',
            name: 'Celo Alfajores',
            icon: '/images/networks/celo.svg',
            description: 'Celo Alfajores Testnet',
        },
        {
            chainId: '0x221',
            name: 'Flow Testnet',
            icon: '/images/networks/flow.svg',
            description: 'Flow Testnet (EVM)',
        },
        {
            chainId: 'world',
            name: 'World Chain',
            icon: '/images/networks/celo.svg', // You can replace with World icon if available
            description: 'World Chain Network',
            disabled: true,
        },
    ];

    const handleNetworkSelection = (chainId: string) => {
        if (chainId === 'world') {
            setShowWorldError(true);
            setTimeout(() => {
                setShowWorldError(false);
            }, 3000);
            return;
        }
        setSelectedNetwork(chainId);
    };

    const handleConfirm = async () => {
        if (!selectedNetwork || selectedNetwork === 'world') return;

        setIsLoading(true);
        try {
            await onSelect(pendingAccounts, selectedNetwork);
        } catch (error) {
            console.error('Error selecting network:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
            <div className="bg-gray-800 pixel-border p-6 w-full max-w-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center text-green-400 minecraft-font">
                    SELECT NETWORK
                </h2>

                <p className="mb-6 text-center text-gray-300 minecraft-font text-sm">
                    Choose a blockchain network to connect to:
                </p>

                {showWorldError && (
                    <div className="mb-4 p-2 bg-red-500/20 border border-red-500 rounded text-center text-red-300 minecraft-font text-sm">
                        Not supporting World Chain now. Please switch to Celo or Flow network.
                    </div>
                )}

                <div className="space-y-4 mb-6">
                    {networks.map((network) => (
                        <button
                            key={network.chainId}
                            className={`w-full py-3 px-4 rounded-md flex items-center space-x-4 text-left transition-colors ${
                                selectedNetwork === network.chainId
                                    ? 'bg-blue-900 border-2 border-blue-500'
                                    : network.disabled
                                      ? 'bg-gray-700 opacity-70 cursor-not-allowed'
                                      : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                            onClick={() => handleNetworkSelection(network.chainId)}
                        >
                            <div className="w-8 h-8 flex-shrink-0 relative">
                                <Image
                                    src={network.icon}
                                    alt={network.name}
                                    className="rounded-full"
                                    fill
                                    sizes="32px"
                                />
                            </div>
                            <div>
                                <div className="font-bold minecraft-font">{network.name}</div>
                                <div className="text-sm text-gray-300">{network.description}</div>
                            </div>
                            {selectedNetwork === network.chainId && !network.disabled && (
                                <div className="ml-auto">
                                    <svg
                                        className="w-6 h-6 text-green-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between space-x-4">
                    <button
                        className="minecraft-btn bg-red-600 hover:bg-red-700"
                        onClick={onCancel}
                    >
                        CANCEL
                    </button>
                    <button
                        className="minecraft-btn bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleConfirm}
                        disabled={isLoading || !selectedNetwork || selectedNetwork === 'world'}
                    >
                        {isLoading ? 'CONNECTING...' : 'CONFIRM'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}
