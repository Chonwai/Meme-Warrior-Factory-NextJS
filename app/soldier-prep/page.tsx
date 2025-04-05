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
    const containerRef = useRef<HTMLDivElement>(null);

    // Check wallet connection status
    useEffect(() => {
        if (!isConnected) {
            // If wallet is not connected, redirect to home page
            router.push('/');
        }
    }, [isConnected, router]);

    // If wallet is not connected, show loading
    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-600">Checking wallet connection status...</p>
            </div>
        );
    }

    // Show typing animation effect
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
    };

    return (
        <div className="min-h-screen bg-gray-900 py-10 px-4 pixel-bg">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-yellow-300 text-center drop-shadow-[2px_2px_0px_#000] pixel-text">
                    Create Your Meme Soldier
                </h1>

                {/* Pokemon style factory scene */}
                <div
                    ref={containerRef}
                    className="relative w-full h-96 pixel-border overflow-hidden mb-8"
                >
                    <div className="absolute inset-0">
                        <Image
                            src="/images/forge.png"
                            alt="Meme Forge"
                            fill
                            className="object-cover pixelated"
                        />
                    </div>

                    {/* Scientist and dialog box in the top left */}
                    {showScientist && (
                        <div className="absolute left-6 top-12 flex items-start">
                            <div className="w-12 h-12 bg-transparent mr-2">
                                {/* Scientist image here */}
                                <div className="pixel-character scientist"></div>
                            </div>
                            <div className={`minecraft-dialog ${isTyping ? 'typing' : ''}`}>
                                <p className="text-sm">
                                    {isTyping
                                        ? 'Thinking...'
                                        : 'Please enter your meme idea! I will forge the strongest soldier for you!'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Prompt input area */}
                <div className="pixel-border bg-black/70 backdrop-blur-sm p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4 text-green-400 pixel-text">
                        Your Soldier Idea
                    </h2>

                    <div className="mb-4">
                        <textarea
                            value={prompt}
                            onChange={handlePromptChange}
                            className="w-full p-3 border-2 border-gray-700 rounded bg-gray-800 text-white minecraft-font"
                            placeholder="Describe the meme you want, e.g.: 'A dog wearing sunglasses with an explosion in the background'"
                            rows={4}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => setShowExamples(!showExamples)}
                            className="text-blue-300 hover:text-blue-400 pixel-text"
                        >
                            {showExamples ? '[ Hide Examples ]' : '[ View Example Prompts ]'}
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={!prompt.trim()}
                            className="minecraft-btn"
                        >
                            Next →
                        </button>
                    </div>

                    {/* Example prompts */}
                    {showExamples && (
                        <div className="mt-4 border-t-2 border-gray-700 pt-4">
                            <h3 className="text-sm font-medium mb-2 text-yellow-300 pixel-text">
                                Creative Prompt Examples:
                            </h3>
                            <ul className="space-y-2">
                                {PROMPT_EXAMPLES.map((example, index) => (
                                    <li
                                        key={index}
                                        onClick={() => selectExample(example)}
                                        className="cursor-pointer p-2 hover:bg-gray-700 rounded text-white minecraft-font"
                                    >
                                        → {example}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex justify-center">
                    <Link href="/" className="text-gray-400 hover:text-gray-300 pixel-text">
                        ← Back to Home
                    </Link>
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

                .pixel-text {
                    font-family: 'Press Start 2P', monospace;
                    letter-spacing: 1px;
                }

                .minecraft-dialog {
                    background-color: rgba(0, 0, 0, 0.7);
                    border: 2px solid #555;
                    padding: 8px 12px;
                    border-radius: 2px;
                    color: white;
                    position: relative;
                    max-width: 250px;
                }

                .minecraft-dialog:before {
                    content: '';
                    position: absolute;
                    left: -8px;
                    top: 10px;
                    border-top: 6px solid transparent;
                    border-bottom: 6px solid transparent;
                    border-right: 8px solid #555;
                }

                .minecraft-dialog.typing:after {
                    content: '...';
                    animation: typing 1s infinite;
                }

                .minecraft-btn {
                    display: inline-block;
                    padding: 8px 16px;
                    font-size: 16px;
                    font-weight: bold;
                    text-transform: uppercase;
                    background-color: #4aae46;
                    border: 3px solid #333;
                    color: white;
                    box-shadow: 3px 3px 0px #222;
                    position: relative;
                    transition: all 0.1s;
                    font-family: 'Press Start 2P', monospace;
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

                .minecraft-font {
                    font-family: 'Minecraft', monospace;
                }

                .pixelated {
                    image-rendering: pixelated;
                }

                .pixel-character {
                    width: 32px;
                    height: 32px;
                    background-color: transparent;
                }

                .scientist {
                    background-image: url('/images/scientist.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
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
