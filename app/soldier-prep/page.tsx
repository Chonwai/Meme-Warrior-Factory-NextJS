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
    const [scientistState, setScientistState] = useState<'idle' | 'active' | 'excited'>('idle');
    const containerRef = useRef<HTMLDivElement>(null);

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

                            {/* MadScientist in the top-left corner with new sprite system */}
                            <div className="absolute top-4 left-4 z-10">
                                <div
                                    className={`character-sprite mad-scientist-sprite sprite-md ${getAnimationClass()} pixel-shadow`}
                                    title="Mad Scientist"
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
                                            className={`character-sprite mad-scientist-sprite sprite-lg ${getAnimationClass()}`}
                                            title="Mad Scientist"
                                        ></div>
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
