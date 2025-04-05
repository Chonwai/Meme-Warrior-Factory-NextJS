'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/wallet-context';
import Image from 'next/image';
import Link from 'next/link';

// Mock soldier data
const MOCK_SOLDIERS = [
    {
        id: 1,
        name: 'DOGE WARRIOR',
        prompt: 'A dog wearing sunglasses with an explosion in the background',
        attributes: {
            humor: 85,
            virality: 92,
            originality: 78,
            strength: 88,
        },
        tokenAmount: 450,
        image: '/images/meme-soldier.png',
        createdAt: '2023-04-05T12:30:00Z',
    },
    {
        id: 2,
        name: 'FROG GENERAL',
        prompt: 'A frog in military uniform holding a command baton',
        attributes: {
            humor: 75,
            virality: 95,
            originality: 65,
            strength: 85,
        },
        tokenAmount: 320,
        image: '/images/dispatcher.png',
        createdAt: '2023-04-05T14:15:00Z',
    },
];

export default function WalletPage() {
    const router = useRouter();
    const { isConnected, walletAddress, balance } = useWallet();
    const [soldiers, setSoldiers] = useState(MOCK_SOLDIERS);
    const [totalTokens, setTotalTokens] = useState(0);

    // Check wallet connection status
    useEffect(() => {
        if (!isConnected) {
            // If wallet not connected, redirect to home
            router.push('/');
        } else {
            // Calculate total tokens
            const total = soldiers.reduce((sum, soldier) => sum + soldier.tokenAmount, 0);
            setTotalTokens(total);
        }
    }, [isConnected, router, soldiers]);

    // If wallet not connected, show loading
    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <p className="minecraft-font text-xl text-gray-300">
                    Checking wallet connection status...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-10 px-4 pixel-bg">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-yellow-300 text-center minecraft-font uppercase tracking-wide">
                    MY WALLET
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Wallet Info */}
                    <div className="pixel-border bg-black/80 p-4">
                        <h2 className="text-xl font-bold mb-4 text-green-400 minecraft-font uppercase">
                            WALLET INFO
                        </h2>
                        <div className="space-y-3">
                            <div className="flex flex-col">
                                <span className="text-gray-400 minecraft-font text-sm">
                                    ADDRESS:
                                </span>
                                <span className="text-white minecraft-font break-all">
                                    {walletAddress}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-400 minecraft-font text-sm">
                                    BALANCE:
                                </span>
                                <span className="text-yellow-300 minecraft-font">
                                    {balance} CELO
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-400 minecraft-font text-sm">
                                    MEME TOKENS:
                                </span>
                                <span className="text-yellow-300 minecraft-font">
                                    {totalTokens}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Soldier Stats */}
                    <div className="pixel-border bg-black/80 p-4">
                        <h2 className="text-xl font-bold mb-4 text-green-400 minecraft-font uppercase">
                            SOLDIER STATS
                        </h2>
                        <div className="space-y-3">
                            <div className="flex flex-col">
                                <span className="text-gray-400 minecraft-font text-sm">
                                    TOTAL SOLDIER TYPES:
                                </span>
                                <span className="text-white minecraft-font">{soldiers.length}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-400 minecraft-font text-sm">
                                    TOTAL SOLDIERS:
                                </span>
                                <span className="text-white minecraft-font">{totalTokens}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-400 minecraft-font text-sm">
                                    SOLDIERS IN BATTLE:
                                </span>
                                <span className="text-white minecraft-font">
                                    {Math.floor(totalTokens / 2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create New Soldier Button */}
                <div className="text-center mb-10">
                    <Link href="/soldier-prep" className="minecraft-btn inline-block mx-auto">
                        CREATE NEW SOLDIER
                    </Link>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-yellow-300 minecraft-font uppercase">
                    MY SOLDIERS
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {soldiers.map((soldier) => (
                        <div key={soldier.id} className="pixel-border bg-black/80 overflow-hidden">
                            <div className="flex">
                                {/* Soldier Image */}
                                <div className="w-32 h-32 bg-gray-800 flex items-center justify-center p-2">
                                    <div className="pixel-border overflow-hidden w-full h-full">
                                        <Image
                                            src={soldier.image}
                                            alt={soldier.name}
                                            width={100}
                                            height={100}
                                            className="pixelated object-contain w-full h-full"
                                        />
                                    </div>
                                </div>

                                {/* Soldier Info */}
                                <div className="flex-1 p-4">
                                    <h3 className="minecraft-font text-lg text-yellow-300 mb-1">
                                        {soldier.name}
                                    </h3>
                                    <p className="minecraft-font text-xs text-gray-400 mb-3">
                                        &ldquo;{soldier.prompt}&rdquo;
                                    </p>

                                    <div className="mb-2">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="minecraft-font text-blue-300">
                                                HUMOR
                                            </span>
                                            <span className="minecraft-font text-blue-300">
                                                {soldier.attributes.humor}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 h-2 pixel-border-sm">
                                            <div
                                                className="bg-blue-500 h-full"
                                                style={{ width: `${soldier.attributes.humor}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="minecraft-font text-green-300">
                                                VIRALITY
                                            </span>
                                            <span className="minecraft-font text-green-300">
                                                {soldier.attributes.virality}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 h-2 pixel-border-sm">
                                            <div
                                                className="bg-green-500 h-full"
                                                style={{ width: `${soldier.attributes.virality}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-700 p-3 flex justify-between items-center minecraft-font">
                                <span className="minecraft-font text-xs text-gray-400">
                                    TOKENS: {soldier.tokenAmount}
                                </span>
                                <Link href="/battlefield" className="minecraft-btn-sm">
                                    DEPLOY TO BATTLE
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .pixel-bg {
                    background-color: #111;
                    background-image: repeating-linear-gradient(
                        #222 0px,
                        #222 2px,
                        #333 2px,
                        #333 4px
                    );
                }

                .pixel-border {
                    border: 4px solid #555;
                    box-shadow: inset 0 0 0 4px #333;
                    background-color: rgba(0, 0, 0, 0.7);
                }

                .pixel-border-sm {
                    border: 2px solid #555;
                    box-shadow: inset 0 0 0 1px #333;
                }

                .minecraft-font {
                    font-family: 'Minecraft', monospace !important;
                }

                .minecraft-btn {
                    display: inline-block;
                    padding: 8px 16px;
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
                    background-color: #4aae46;
                    border: 3px solid #333;
                    color: white;
                    box-shadow: 3px 3px 0px #222;
                    position: relative;
                    transition: all 0.1s;
                    font-family: 'Minecraft', monospace !important;
                    letter-spacing: 1px;
                    cursor: pointer;
                    text-align: center;
                }

                .minecraft-btn:hover {
                    background-color: #5bbf56;
                    transform: translateY(-2px);
                }

                .minecraft-btn:active {
                    background-color: #3a9d36;
                    transform: translateY(2px);
                    box-shadow: 1px 1px 0px #222;
                }

                .minecraft-btn-sm {
                    display: inline-block;
                    padding: 4px 8px;
                    font-size: 10px;
                    font-weight: bold;
                    text-transform: uppercase;
                    background-color: #f59e0b;
                    border: 2px solid #333;
                    color: white;
                    box-shadow: 2px 2px 0px #222;
                    position: relative;
                    transition: all 0.1s;
                    font-family: 'Minecraft', monospace !important;
                    letter-spacing: 1px;
                    cursor: pointer;
                }

                .minecraft-btn-sm:hover {
                    background-color: #f97316;
                    transform: translateY(-1px);
                }

                .minecraft-btn-sm:active {
                    background-color: #d97706;
                    transform: translateY(1px);
                    box-shadow: 1px 1px 0px #222;
                }

                .pixelated {
                    image-rendering: pixelated;
                }
            `}</style>
        </div>
    );
}
