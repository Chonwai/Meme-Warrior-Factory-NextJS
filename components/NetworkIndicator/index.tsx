'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useWallet } from '@/lib/wallet-context';

export default function NetworkIndicator() {
    const { networkInfo, switchNetwork, setShowNetworkModal } = useWallet();
    const [showNetworkSelector, setShowNetworkSelector] = useState(false);
    const [switchingNetwork, setSwitchingNetwork] = useState<string | null>(null);

    // Networks to display in the dropdown
    const networks = [
        { chainId: '0xaef3', name: 'Celo Alfajores', icon: '/images/networks/celo.svg' },
        { chainId: '0x221', name: 'Flow Testnet', icon: '/images/networks/flow.svg' },
    ];

    // Toggle network selector dropdown
    const toggleNetworkSelector = () => {
        setShowNetworkSelector(!showNetworkSelector);
    };

    // Open network selection modal
    const openNetworkModal = () => {
        setShowNetworkSelector(false);
        setShowNetworkModal(true);
    };

    // Handle network switch directly
    const handleNetworkSwitch = async (chainId: string) => {
        if (switchingNetwork) return; // Prevent multiple clicks

        try {
            // Set switching state to show loading
            setSwitchingNetwork(chainId);
            
            await switchNetwork(chainId);
            
            // Hide the dropdown after successful switch
            setShowNetworkSelector(false);
        } catch (error) {
            console.error('Failed to switch network:', error);
            alert('Failed to switch network. Please try again or switch manually in your wallet settings.');
        } finally {
            // Clear switching state
            setSwitchingNetwork(null);
        }
    };
    
    // Generate a network icon placeholder if the real icon is not available
    const getNetworkIcon = (networkName: string, iconPath: string) => {
        const firstLetter = networkName.charAt(0).toUpperCase();
        
        return (
            <div className="relative w-6 h-6">
                <Image 
                    src={iconPath} 
                    alt={networkName}
                    width={24}
                    height={24}
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
                    className="absolute inset-0 bg-gray-700 rounded-full hidden items-center justify-center text-white text-xs font-bold"
                    style={{ display: 'none' }}
                >
                    {firstLetter}
                </div>
            </div>
        );
    };

    if (!networkInfo) {
        return null;
    }

    return (
        <div className="relative">
            <button 
                onClick={toggleNetworkSelector}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-sm minecraft-font transition-colors duration-200"
            >
                {getNetworkIcon(networkInfo.chainName, networkInfo.icon)}
                <span className="text-xs md:text-sm">
                    {networkInfo.chainName}
                </span>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transition-transform duration-200 ${showNetworkSelector ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Network selector dropdown */}
            {showNetworkSelector && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border-2 border-gray-700 rounded-md shadow-lg z-50 pixel-border">
                    <div className="py-1">
                        {networks.map((network) => (
                            <button
                                key={network.chainId}
                                id={`network-${network.chainId}`}
                                disabled={switchingNetwork !== null}
                                className={`w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-700 transition-colors duration-200 ${
                                    networkInfo.chainId === network.chainId ? 'bg-gray-700' : ''
                                } ${switchingNetwork === network.chainId ? 'opacity-75' : ''}`}
                                onClick={() => handleNetworkSwitch(network.chainId)}
                            >
                                {getNetworkIcon(network.name, network.icon)}
                                <span className="text-sm minecraft-font">
                                    {switchingNetwork === network.chainId ? (
                                        <span className="animate-pulse">Switching...</span>
                                    ) : (
                                        network.name
                                    )}
                                </span>
                                {networkInfo.chainId === network.chainId && !switchingNetwork && (
                                    <span className="ml-auto text-green-400">✓</span>
                                )}
                            </button>
                        ))}
                        
                        {/* Add a "Change Network" option at the bottom */}
                        <div className="border-t border-gray-700 mt-1 pt-1">
                            <button
                                className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-700 transition-colors duration-200"
                                onClick={openNetworkModal}
                            >
                                <span className="text-sm minecraft-font text-blue-400">
                                    Change Network...
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 