'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createPublicClient, createWalletClient, custom, parseEther, Chain } from 'viem';
import { celoAlfajores } from 'viem/chains';
import { useWallet } from '../../../lib/wallet-context';

// Character state type
type CharacterState = 'idle' | 'active' | 'excited';

// Client component - using searchParams
function ConfirmContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    const [blacksmithState, setBlacksmithState] = useState<CharacterState>('idle');
    const [isSigning, setIsSigning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isConnected, connectWallet, networkInfo } = useWallet();

    // Handle search params, only execute when searchParams changes
    useEffect(() => {
        if (!searchParams) return;

        const promptParam = searchParams.get('prompt');
        if (promptParam) {
            setPrompt(decodeURIComponent(promptParam));
        } else {
            // If no prompt parameter, return to input page
            router.push('/soldier-prep');
        }
    }, [searchParams, router]);

    // Animate blacksmith when user agrees to terms
    useEffect(() => {
        if (isAgreed) {
            // Excited animation when user agrees
            setBlacksmithState('excited');
        } else {
            // Idle animation when not agreed yet
            setBlacksmithState('idle');
        }
    }, [isAgreed]);

    // Create custom chain configuration
    const createChainConfig = (networkInfo: any): Chain => {
        // Use predefined config for Celo testnet
        if (networkInfo.chainId === '0xaef3') {
            return celoAlfajores;
        }

        // Create custom config for other networks
        return {
            id: parseInt(networkInfo.chainId, 16),
            name: networkInfo.chainName,
            nativeCurrency: {
                name: networkInfo.nativeCurrency.name,
                symbol: networkInfo.nativeCurrency.symbol,
                decimals: networkInfo.nativeCurrency.decimals,
            },
            rpcUrls: {
                default: {
                    http: networkInfo.rpcUrls,
                },
                public: {
                    http: networkInfo.rpcUrls,
                },
            },
            blockExplorers: networkInfo.blockExplorerUrls?.length
                ? {
                      default: {
                          name: 'Explorer',
                          url: networkInfo.blockExplorerUrls[0],
                      },
                  }
                : undefined,
        } as Chain;
    };

    const handleConfirm = async () => {
        if (isAgreed && prompt) {
            setIsSigning(true);
            setBlacksmithState('active');
            setError(null);

            try {
                // Check if wallet is connected, try to connect if not
                if (!isConnected) {
                    await connectWallet();
                }

                // Ensure ethereum object exists (MetaMask)
                if (typeof window.ethereum === 'undefined') {
                    throw new Error('MetaMask is not installed or unavailable');
                }

                // Check if network info is available
                if (!networkInfo) {
                    throw new Error('No network information, please ensure wallet is connected');
                }

                // Create current network configuration
                const currentChain = createChainConfig(networkInfo);

                // Prepare client using current selected chain
                const publicClient = createPublicClient({
                    chain: currentChain,
                    transport: custom(window.ethereum),
                });

                const walletClient = createWalletClient({
                    chain: currentChain,
                    transport: custom(window.ethereum),
                });

                // Get user address
                const [address] = await walletClient.getAddresses();

                // Create contract and parameters
                // In real scenario, these values should be from config or parameters
                const contractAddress = process.env.NEXT_PUBLIC_WARRIOR_FACTORY_ADDRESS;
                const mintPrice = parseEther('0.01');

                // Use prompt to prepare data, like creating hash or other data for signing
                const dataToSign = `Meme Warrior Generation: ${prompt}`;

                // Execute transaction
                const hash = await walletClient.sendTransaction({
                    account: address,
                    to: contractAddress as `0x${string}`,
                    value: mintPrice,
                    data: `0x${Buffer.from(dataToSign).toString('hex')}`,
                });

                console.log('Transaction submitted, hash:', hash);

                // Wait for transaction confirmation
                const receipt = await publicClient.waitForTransactionReceipt({ hash });
                console.log('Transaction confirmed:', receipt);

                // Keep existing animation and navigation logic
                setTimeout(() => {
                    // Navigate to generation page, continuing to pass the prompt parameter
                    router.push(`/soldier-prep/generating?prompt=${encodeURIComponent(prompt)}`);
                }, 800);
            } catch (err) {
                console.error('Signature or transaction error:', err);
                setError(
                    err instanceof Error ? err.message : 'Transaction failed, please try again'
                );
                setBlacksmithState('idle');
            } finally {
                setIsSigning(false);
            }
        }
    };

    // Get the correct animation class based on blacksmith state
    const getBlacksmithClass = () => {
        switch (blacksmithState) {
            case 'excited':
                return 'sprite-excited';
            case 'active':
                return 'sprite-active';
            default:
                return 'sprite-idle';
        }
    };

    return (
        <>
            {/* Three-column layout */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                {/* Left sidebar: Blacksmith dialogue - 30% width */}
                <div className="lg:w-[30%] order-2 lg:order-1">
                    <div className="pixel-border bg-black/80 p-4 h-full flex flex-col">
                        <div className="mb-4 flex justify-center flex-col items-center">
                            <Image
                                src="/images/blacksmith.png"
                                alt="Blacksmith"
                                width={120}
                                height={120}
                                className="pixelated"
                            />
                        </div>
                        <div className={`minecraft-dialog w-full ${isAgreed ? 'active' : ''}`}>
                            <p className="minecraft-font text-white text-sm">
                                {isSigning
                                    ? 'PREPARING GENERATION, PLEASE CONFIRM WALLET TRANSACTION...'
                                    : isAgreed
                                      ? 'READY TO FORGE! PLEASE CONFIRM THE DETAILS...'
                                      : 'ARE YOU SURE YOU WANT TO FORGE THIS SOLDIER? 50% WILL BE DEPLOYED TO THE BATTLEFIELD!'}
                            </p>
                            {error && (
                                <p className="minecraft-font text-red-500 text-sm mt-2">
                                    Error: {error}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Middle column: Forge canvas - 40% width */}
                <div className="lg:w-[40%] order-1 lg:order-2">
                    <div
                        className="relative pixel-border overflow-hidden"
                        style={{ height: '70vh' }}
                    >
                        <div className="absolute inset-0">
                            <Image
                                src="/images/forge.png"
                                alt="Meme Forge"
                                fill
                                className="object-cover pixelated"
                            />
                        </div>

                        {/* Blacksmith in the top-right corner */}
                        <div className="absolute top-32 right-8 z-10 z-10">
                            <Image
                                src="/images/blacksmith.png"
                                alt="Blacksmith"
                                width={64}
                                height={64}
                                className="pixelated"
                            />
                        </div>

                        {/* Animation effect when agreed */}
                        {isAgreed && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="forge-prepare-animation"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right sidebar: Confirmation details - 30% width */}
                <div className="lg:w-[30%] order-3">
                    <div className="pixel-border bg-black/80 p-4 h-full flex flex-col">
                        <h2 className="text-xl font-bold mb-4 text-green-400 minecraft-font uppercase">
                            CONFIRM DETAILS
                        </h2>

                        <div className="mb-4 p-3 bg-gray-800 border-2 border-gray-700 rounded">
                            <h3 className="text-sm font-semibold mb-1 text-yellow-300 minecraft-font uppercase">
                                YOUR PROMPT:
                            </h3>
                            <p className="text-gray-300 minecraft-font italic text-sm">
                                &quot;{prompt}&quot;
                            </p>
                        </div>

                        <div className="mb-6 p-3 bg-yellow-900/40 border-2 border-yellow-700 rounded">
                            <h3 className="text-sm font-semibold mb-1 text-yellow-300 minecraft-font uppercase">
                                PLEASE NOTE:
                            </h3>
                            <ul className="list-none pl-0 space-y-1 text-xs text-gray-300 minecraft-font">
                                <li className="flex items-start">
                                    <span className="text-yellow-500 mr-2">→</span>
                                    <span>50% OF TOKENS DEPLOYED TO BATTLEFIELD</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-yellow-500 mr-2">→</span>
                                    <span>DEPLOYED SOLDIERS MAY BE LOST IN BATTLE</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-yellow-500 mr-2">→</span>
                                    <span>50% SAVED IN YOUR WALLET</span>
                                </li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <label className="flex items-start cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={isAgreed}
                                    onChange={() => setIsAgreed(!isAgreed)}
                                    className="mt-1 mr-3 h-4 w-4 cursor-pointer"
                                />
                                <span className="text-xs text-gray-300 group-hover:text-gray-200 minecraft-font">
                                    I AGREE TO DEPLOY 50% OF TOKENS TO BATTLEFIELD
                                </span>
                            </label>
                        </div>

                        <div className="mt-auto flex flex-col space-y-3 minecraft-font">
                            <button
                                onClick={handleConfirm}
                                disabled={!isAgreed || isSigning}
                                className={
                                    isAgreed && !isSigning
                                        ? 'minecraft-btn w-full'
                                        : 'minecraft-btn-disabled w-full'
                                }
                            >
                                {isSigning ? 'PROCESSING...' : 'CONFIRM AND GENERATE →'}
                            </button>

                            <Link
                                href="/soldier-prep"
                                className="minecraft-btn-secondary w-full text-center"
                            >
                                ← BACK TO EDIT
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Main page component
export default function ConfirmPage() {
    return (
        <div className="min-h-screen bg-gray-900 py-10 px-4 pixel-bg">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-yellow-300 text-center minecraft-font uppercase tracking-wide">
                    CONFIRM SOLDIER GENERATION
                </h1>

                <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
                    <ConfirmContent />
                </Suspense>
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

                .minecraft-dialog {
                    background-color: rgba(0, 0, 0, 0.7);
                    border: 2px solid #555;
                    padding: 8px 12px;
                    border-radius: 2px;
                    color: white;
                    position: relative;
                }

                .minecraft-dialog.active {
                    border-color: #10b981;
                    box-shadow: 0 0 8px #10b981;
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
                    font-family: 'Minecraft', monospace;
                    letter-spacing: 1px;
                    cursor: pointer;
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

                .minecraft-btn-secondary {
                    display: inline-block;
                    padding: 8px 16px;
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
                    background-color: #777;
                    border: 3px solid #333;
                    color: white;
                    box-shadow: 3px 3px 0px #222;
                    position: relative;
                    transition: all 0.1s;
                    font-family: 'Minecraft', monospace;
                    letter-spacing: 1px;
                    cursor: pointer;
                }

                .minecraft-btn-secondary:hover {
                    background-color: #888;
                    transform: translateY(-2px);
                }

                .minecraft-btn-secondary:active {
                    background-color: #666;
                    transform: translateY(2px);
                    box-shadow: 1px 1px 0px #222;
                }

                .minecraft-btn-disabled {
                    display: inline-block;
                    padding: 8px 16px;
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
                    background-color: #656565;
                    border: 3px solid #333;
                    color: #999;
                    box-shadow: 3px 3px 0px #222;
                    position: relative;
                    font-family: 'Minecraft', monospace;
                    letter-spacing: 1px;
                    cursor: not-allowed;
                }

                .pixelated {
                    image-rendering: pixelated;
                }

                .forge-prepare-animation {
                    width: 128px;
                    height: 128px;
                    background-color: rgba(255, 102, 0, 0.2);
                    border-radius: 50%;
                    box-shadow: 0 0 30px 15px rgba(255, 102, 0, 0.3);
                    animation: prepare-forge 1.5s infinite alternate;
                }

                @keyframes prepare-forge {
                    0% {
                        opacity: 0.4;
                        transform: scale(0.8);
                    }
                    100% {
                        opacity: 0.8;
                        transform: scale(1.2);
                    }
                }
            `}</style>
        </div>
    );
}
