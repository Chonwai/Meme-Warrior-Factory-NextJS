'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/wallet-context';

// Creative prompt examples
const PROMPT_EXAMPLES = [
    'A dog wearing sunglasses with an explosion in the background',
    'A crying cat wearing a crown',
    'A dinosaur in a suit at a meeting',
    'Pixel-style astronaut dancing on the moon',
];

export default function SoldierPrep() {
    const router = useRouter();
    const { isConnected } = useWallet();
    const [prompt, setPrompt] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showExamples, setShowExamples] = useState(false);
    const [showScientist, setShowScientist] = useState(true);
    const [currentFrame, setCurrentFrame] = useState(0); // 0: top-left, 1: top-right, 2: bottom-left, 3: bottom-right
    const containerRef = useRef<HTMLDivElement>(null);
    const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Check wallet connection status
    useEffect(() => {
        if (!isConnected) {
            // If wallet is not connected, redirect to home page
            router.push('/');
        }
    }, [isConnected, router]);

    // Animation control based on typing state
    useEffect(() => {
        // Clear any existing animation
        if (animationIntervalRef.current) {
            clearInterval(animationIntervalRef.current);
            animationIntervalRef.current = null;
        }

        if (isTyping) {
            // Start animation when typing
            animationIntervalRef.current = setInterval(() => {
                setCurrentFrame((prevFrame) => (prevFrame + 1) % 4);
            }, 300); // Change frame every 300ms
        } else {
            // Create a timeout to stop animation after delay when not typing
            const stopTimeout = setTimeout(() => {
                if (animationIntervalRef.current) {
                    clearInterval(animationIntervalRef.current);
                    animationIntervalRef.current = null;
                    // Reset to default pose when idle
                    setCurrentFrame(0);
                }
            }, 2000);

            return () => clearTimeout(stopTimeout);
        }

        // Clear animation interval on component unmount or when deps change
        return () => {
            if (animationIntervalRef.current) {
                clearInterval(animationIntervalRef.current);
                animationIntervalRef.current = null;
            }
        };
    }, [isTyping]);

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

    return (
        <div className="min-h-screen bg-gray-900 py-10 px-4 pixel-bg">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-yellow-300 text-center minecraft-font uppercase tracking-wide">
                    CREATE YOUR MEME SOLDIER
                </h1>

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
                                        className="text-gray-400 hover:text-gray-300 minecraft-font text-xs"
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
                                />
                            </div>

                            {/* MadScientist in the top-left corner */}
                            <div className="absolute top-28 left-20 z-10">
                                <div
                                    className={`pixel-character mad-scientist sprite-frame-${currentFrame}`}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Right sidebar: Scientist dialogue - 30% width */}
                    <div className="lg:w-[30%] order-3">
                        <div className="pixel-border bg-black/80 p-4 h-full flex flex-col">
                            {showScientist && (
                                <>
                                    <div className="mb-4 flex justify-center">
                                        <div
                                            className={`pixel-character scientist-portrait w-24 h-24 sprite-frame-${currentFrame}`}
                                        ></div>
                                    </div>
                                    <div
                                        className={`minecraft-dialog w-full ${isTyping ? 'typing' : ''}`}
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

                .minecraft-font {
                    font-family: 'Minecraft', monospace;
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

                .pixel-character {
                    background-color: transparent;
                    width: 64px;
                    height: 64px;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    image-rendering: pixelated;
                }

                .scientist-portrait {
                    width: 64px;
                    height: 64px;
                }

                .mad-scientist {
                    background-image: url('/images/MadScientist.png');
                }

                /* Sprite frames for animation */
                .sprite-frame-0 {
                    background-position: 0% 0%; /* Top-left frame */
                }

                .sprite-frame-1 {
                    background-position: 100% 0%; /* Top-right frame */
                }

                .sprite-frame-2 {
                    background-position: 0% 100%; /* Bottom-left frame */
                }

                .sprite-frame-3 {
                    background-position: 100% 100%; /* Bottom-right frame */
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
