'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useWallet } from '@/lib/wallet-context';

export default function NetworkSelectionModal({ onClose }: { onClose: () => void }) {
    const { networkInfo, switchNetwork } = useWallet();
    const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Networks to display in the modal
    const networks = [
        {
            chainId: '0xaef3',
            name: 'Celo Alfajores',
            icon: '/images/networks/celo.svg',
            description: 'Celo Alfajores Testnet - EVM compatible',
        },
        {
            chainId: '0xa4ec',
            name: 'Celo',
            icon: '/images/networks/celo.svg',
            description: 'Celo Mainnet - EVM compatible blockchain',
        },
        {
            chainId: '0x3a44',
            name: 'World Chain',
            icon: '/images/networks/celo.svg',
            description: 'World Chain Network',
        },
        {
            chainId: '0x12',
            name: 'Flow Testnet',
            icon: '/images/networks/flow.svg',
            description: 'Flow Testnet for NFTs and gaming (non-EVM)',
        },
    ];

    // Pre-select current network if it's one of our supported networks
    useEffect(() => {
        if (
            networkInfo &&
            (networkInfo.chainId === '0xaef3' ||
                networkInfo.chainId === '0xa4ec' ||
                networkInfo.chainId === '0x3a44' ||
                networkInfo.chainId === '0x12')
        ) {
            setSelectedNetwork(networkInfo.chainId);
        } else {
            // Default to Celo if no network is selected
            setSelectedNetwork('0xaef3');
        }
    }, [networkInfo]);

    // Handle network selection
    const handleNetworkSelect = (chainId: string) => {
        setSelectedNetwork(chainId);
    };

    // Handle confirming the network choice
    const handleConfirm = async () => {
        if (!selectedNetwork) return;

        setIsLoading(true);

        try {
            // Flow requires special handling
            if (selectedNetwork === '0x12') {
                alert(
                    'Flow blockchain is not directly supported by MetaMask as it is not EVM-compatible. You would need to use a Flow-specific wallet like Blocto.'
                );
                onClose();
                return;
            }

            // Switch network if not already on it
            if (networkInfo?.chainId !== selectedNetwork) {
                await switchNetwork(selectedNetwork);
            }

            onClose();
        } catch (error) {
            console.error('Error switching network:', error);
            alert('Failed to switch network. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Generate a network icon placeholder if the real icon is not available
    const getNetworkIcon = (networkName: string, iconPath: string) => {
        const firstLetter = networkName.charAt(0).toUpperCase();

        return (
            <div className="relative w-8 h-8">
                <Image
                    src={iconPath}
                    alt={networkName}
                    width={32}
                    height={32}
                    className="rounded-full"
                    onError={(e) => {
                        // If image fails to load, replace with a letter placeholder
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const nextElement = target.nextElementSibling as HTMLDivElement;
                        if (nextElement) {
                            nextElement.style.display = 'flex';
                        }
                    }}
                />
                <div
                    className="absolute inset-0 bg-gray-700 rounded-full hidden items-center justify-center text-white text-base font-bold"
                    style={{ display: 'none' }}
                >
                    {firstLetter}
                </div>
            </div>
        );
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

                <div className="space-y-4 mb-6">
                    {networks.map((network) => (
                        <button
                            key={network.chainId}
                            className={`w-full py-3 px-4 rounded-md flex items-center space-x-4 text-left transition-colors ${
                                selectedNetwork === network.chainId
                                    ? 'bg-blue-900 border-2 border-blue-500'
                                    : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                            onClick={() => handleNetworkSelect(network.chainId)}
                        >
                            {getNetworkIcon(network.name, network.icon)}
                            <div>
                                <div className="font-bold minecraft-font">{network.name}</div>
                                <div className="text-sm text-gray-300">{network.description}</div>
                            </div>
                            {selectedNetwork === network.chainId && (
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

                <div className="flex justify-center space-x-4">
                    <button
                        className="minecraft-btn bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleConfirm}
                        disabled={isLoading || !selectedNetwork}
                    >
                        {isLoading ? 'CONNECTING...' : 'CONFIRM'}
                    </button>
                </div>
            </div>
        </div>
    );
}
