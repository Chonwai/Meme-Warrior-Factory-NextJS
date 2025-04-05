'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWallet } from '@/lib/wallet-context';
import { useWorldID } from '@/lib/world-id-context';

// Creative prompt examples
const PROMPT_EXAMPLES = [
    'A dog wearing sunglasses with an explosion in the background',
    'A crying cat wearing a crown',
    'A dinosaur in a suit at a meeting',
    'Pixel-style astronaut dancing on the moon',
];

// Create a client component that will use the search params
function WorldIDAuthBanner() {
    const searchParams = useSearchParams();
    const { isWorldIDVerified, worldWalletAddress } = useWorldID();
    const [isAuthWithWorldID, setIsAuthWithWorldID] = useState(false);

    // Check if user came from World ID authentication
    useEffect(() => {
        if (searchParams) {
            const authParam = searchParams.get('auth');
            if (authParam === 'world' && isWorldIDVerified) {
                setIsAuthWithWorldID(true);
                // Show a welcome message
                setTimeout(() => {
                    setIsAuthWithWorldID(false);
                }, 5000); // Hide the message after 5 seconds
            }
        }
    }, [searchParams, isWorldIDVerified]);

    if (!isAuthWithWorldID) return null;

    return (
        <div className="mb-6 p-4 bg-purple-900/70 border-2 border-purple-500 rounded-lg text-center animate-pulse">
            <div className="flex items-center justify-center space-x-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                </svg>
                <span className="minecraft-font text-purple-300 font-bold">
                    AUTHENTICATED WITH WORLD ID
                    {worldWalletAddress && (
                        <span className="block text-xs mt-1 opacity-80">
                            World Wallet: {worldWalletAddress.substring(0, 6)}...
                            {worldWalletAddress.substring(worldWalletAddress.length - 4)}
                        </span>
                    )}
                </span>
            </div>
        </div>
    );
}

export default function SoldierPrep() {
    const router = useRouter();
    const { isConnected } = useWallet();
    const [prompt, setPrompt] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showExamples, setShowExamples] = useState(false);
    const [showScientist, setShowScientist] = useState(true);
    const [scientistState, setScientistState] = useState<'idle' | 'active' | 'excited'>('idle');
    const containerRef = useRef<HTMLDivElement>(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Check wallet connection status
    useEffect(() => {
        if (!isConnected) {
            // If wallet is not connected, redirect to home page
            router.push('/');
        }
    }, [isConnected, router]);

    // Animation control based on typing state
    useEffect(() => {
        if (isTyping) {
            // Excited animation when typing
            setScientistState('excited');

            // Return to active state after typing stops
            const timeout = setTimeout(() => {
                setScientistState('active');
            }, 1000);

            return () => clearTimeout(timeout);
        } else {
            // After brief delay, return to idle state if not typing
            const idleTimeout = setTimeout(() => {
                setScientistState('idle');
            }, 2000);

            return () => clearTimeout(idleTimeout);
        }
    }, [isTyping]);

    // 前置加載圖片
    useEffect(() => {
        const preloadImages = async () => {
            try {
                const imageUrls = [
                    '/images/mad-scientist.png',
                    '/images/blacksmith.png',
                    '/images/dispatcher.png',
                    '/images/meme-soldier.png',
                ];

                const promises = imageUrls.map((url) => {
                    return new Promise((resolve, reject) => {
                        const img = new window.Image();
                        img.src = url;
                        img.onload = () => resolve(url);
                        img.onerror = () => reject(`無法加載圖片: ${url}`);
                    });
                });

                await Promise.all(promises);
                setImagesLoaded(true);
                console.log('所有精靈圖加載完成');
            } catch (error) {
                console.error('圖片加載失敗:', error);
            }
        };

        preloadImages();
    }, []);

    // If wallet is not connected, show loading
    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <p className="minecraft-font text-xl text-gray-300">
                    Checking wallet connection status...
                </p>
            </div>
        );
    }

    // Show typing animation effect and animate scientist
    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
        setIsTyping(true);

        // Brief delay before stopping typing effect
        setTimeout(() => setIsTyping(false), 1000);
    };

    const handleSubmit = () => {
        if (prompt.trim()) {
            // After submission, navigate to confirmation page, passing prompt as a query parameter
            router.push(`/soldier-prep/confirm?prompt=${encodeURIComponent(prompt)}`);
        }
    };

    // Select example prompt
    const selectExample = (example: string) => {
        setPrompt(example);
        setShowExamples(false);
        // Trigger typing animation when example is selected
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 1000);
    };

    // Get the correct animation class based on scientist state
    const getAnimationClass = () => {
        switch (scientistState) {
            case 'active':
                return 'sprite-active';
            case 'excited':
                return 'sprite-excited';
            default:
                return 'sprite-idle';
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-10 px-4 pixel-bg">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-yellow-300 text-center minecraft-font uppercase tracking-wide">
                    CREATE YOUR MEME SOLDIER
                </h1>

                <Suspense fallback={null}>
                    <WorldIDAuthBanner />
                </Suspense>

                {/* Three-column layout */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    {/* Left sidebar: Prompt input area - 30% width */}
                    <div className="lg:w-[30%] order-1">
                        <div className="pixel-border bg-black/80 p-4 h-full flex flex-col">
                            <h2 className="text-xl font-bold mb-4 text-green-400 minecraft-font uppercase">
                                YOUR SOLDIER IDEA
                            </h2>

                            <div className="mb-4 flex-grow">
                                <textarea
                                    value={prompt}
                                    onChange={handlePromptChange}
                                    className="w-full h-32 p-3 border-2 border-gray-700 rounded bg-gray-800 text-white minecraft-font"
                                    placeholder="Describe the meme you want, e.g.: 'A dog wearing sunglasses with an explosion in the background'"
                                />
                            </div>

                            <div className="mt-auto">
                                <div className="flex justify-between items-center mb-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowExamples(!showExamples)}
                                        className="text-blue-300 hover:text-blue-400 minecraft-font text-sm"
                                    >
                                        {showExamples ? '[ HIDE EXAMPLES ]' : '[ VIEW EXAMPLES ]'}
                                    </button>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={!prompt.trim()}
                                        className="minecraft-btn"
                                    >
                                        NEXT →
                                    </button>
                                </div>

                                {/* Example prompts */}
                                {showExamples && (
                                    <div className="mt-2 border-t-2 border-gray-700 pt-2">
                                        <h3 className="text-xs font-medium mb-1 text-yellow-300 minecraft-font">
                                            EXAMPLES:
                                        </h3>
                                        <ul className="space-y-1 max-h-24 overflow-y-auto">
                                            {PROMPT_EXAMPLES.map((example, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => selectExample(example)}
                                                    className="cursor-pointer p-1 hover:bg-gray-700 rounded text-white minecraft-font text-xs"
                                                >
                                                    → {example}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="text-center mt-3">
                                    <Link
                                        href="/"
                                        className="text-gray-400 hover:text-gray-300 minecraft-btn"
                                    >
                                        ← BACK TO HOME
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle column: Forge canvas - 40% width */}
                    <div className="lg:w-[40%] order-2">
                        <div
                            ref={containerRef}
                            className="relative pixel-border overflow-hidden"
                            style={{ height: '70vh' }}
                        >
                            <div className="absolute inset-0">
                                <Image
                                    src="/images/forge.png"
                                    alt="Meme Forge"
                                    fill
                                    className="object-cover pixelated"
                                    priority
                                />
                            </div>

                            {/* MadScientist in the top-left corner with static image */}
                            <div className="absolute top-32 left-28 z-10">
                                <Image
                                    src="/images/mad-scientist.png"
                                    alt="Mad Scientist"
                                    width={64}
                                    height={64}
                                    className="pixelated"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right sidebar: Scientist dialogue - 30% width */}
                    <div className="lg:w-[30%] order-3">
                        <div className="pixel-border bg-black/80 p-4 h-full flex flex-col">
                            {showScientist && (
                                <>
                                    <div className="mb-4 flex justify-center flex-col items-center">
                                        <Image
                                            src="/images/mad-scientist.png"
                                            alt="Mad Scientist"
                                            width={120}
                                            height={120}
                                            className="pixelated"
                                        />
                                    </div>
                                    <div
                                        className={`minecraft-dialog w-full ${isTyping ? 'typing' : ''} ${scientistState === 'excited' ? 'pixel-border-animated' : ''}`}
                                    >
                                        <p className="minecraft-font text-white text-sm">
                                            {isTyping
                                                ? 'THINKING...'
                                                : 'PLEASE ENTER YOUR MEME IDEA! I WILL FORGE THE STRONGEST SOLDIER FOR YOU!'}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
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

                .minecraft-dialog {
                    background-color: rgba(0, 0, 0, 0.7);
                    border: 2px solid #555;
                    padding: 8px 12px;
                    border-radius: 2px;
                    color: white;
                    position: relative;
                }

                .minecraft-dialog.typing:after {
                    content: '...';
                    animation: typing 1s infinite;
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

                .minecraft-btn:disabled {
                    background-color: #656565;
                    color: #999;
                    cursor: not-allowed;
                    transform: none;
                }

                .pixelated {
                    image-rendering: pixelated;
                }

                @keyframes typing {
                    0%,
                    100% {
                        content: '.';
                    }
                    33% {
                        content: '..';
                    }
                    66% {
                        content: '...';
                    }
                }
            `}</style>
        </div>
    );
}
