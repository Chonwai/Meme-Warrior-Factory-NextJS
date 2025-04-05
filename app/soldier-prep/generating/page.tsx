'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Simulated AI dialogue
const AI_DIALOGUE = [
    'Analyzing your creative prompt...',
    'I see it! This meme has great potential!',
    'Conceptualizing the best form of expression...',
    'Preparing visual elements...',
    'Adjusting humor and visual impact...',
    'Generating pixel soldier image...',
    'Assigning battle attributes...',
    'Final touches...',
    'Complete! Your Meme Soldier is born!',
];

export default function GeneratingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const promptParam = searchParams.get('prompt');
        if (promptParam) {
            setPrompt(decodeURIComponent(promptParam));
        } else {
            // If no prompt parameter, return to input page
            router.push('/soldier-prep');
        }

        // Simulate AI generation process
        const dialogueInterval = setInterval(() => {
            setDialogueIndex((prev) => {
                if (prev < AI_DIALOGUE.length - 1) {
                    return prev + 1;
                } else {
                    clearInterval(dialogueInterval);
                    // Set completion status after last dialogue
                    setTimeout(() => setIsComplete(true), 1500);
                    return prev;
                }
            });
        }, 2000);

        // Progress bar animation
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 100) {
                    return prev + 1;
                } else {
                    clearInterval(progressInterval);
                    return 100;
                }
            });
        }, 180); // About 18 seconds to complete

        return () => {
            clearInterval(dialogueInterval);
            clearInterval(progressInterval);
        };
    }, [searchParams, router]);

    const handleContinue = () => {
        // After completion, navigate to result page
        router.push(`/soldier-prep/result?prompt=${encodeURIComponent(prompt)}`);
    };

    return (
        <div className="min-h-screen bg-gray-900 py-10 px-4 pixel-bg">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-yellow-300 text-center drop-shadow-[2px_2px_0px_#000] pixel-text">
                    Soldier Forging in Progress
                </h1>

                {/* Pokemon style factory scene */}
                <div className="relative w-full h-96 pixel-border overflow-hidden mb-8">
                    <div className="absolute inset-0">
                        <Image
                            src="/images/forge.png"
                            alt="Meme Forge"
                            fill
                            className="object-cover pixelated"
                        />
                    </div>

                    {/* Training ground animation */}
                    <div className="absolute left-0 bottom-0 w-full h-full flex items-center justify-center">
                        <div className="pixel-forge-animation"></div>
                    </div>

                    {/* Center display of current generation progress */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6">
                        <div className="pixel-border bg-black/80 w-full max-w-md p-6">
                            <h3 className="font-bold mb-3 text-center text-green-400 pixel-text">
                                AI is Forging
                            </h3>
                            <div className="chat-bubble mb-4">
                                <p className="minecraft-font text-white">
                                    {AI_DIALOGUE[dialogueIndex]}
                                </p>
                            </div>

                            {/* Pixel-style progress bar */}
                            <div className="progress-container mb-2">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-right text-gray-400 minecraft-font">
                                {progress}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Control area */}
                <div className="pixel-border bg-black/70 backdrop-blur-sm p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4 text-green-400 pixel-text">
                        Forging in Progress
                    </h2>

                    <div className="mb-6 p-4 bg-gray-800 border-2 border-gray-700 rounded">
                        <h3 className="text-sm font-semibold mb-2 text-yellow-300 pixel-text">
                            Your Creative Prompt:
                        </h3>
                        <p className="text-gray-300 minecraft-font italic">&quot;{prompt}&quot;</p>
                    </div>

                    {isComplete ? (
                        <div className="flex justify-center">
                            <button onClick={handleContinue} className="minecraft-btn-gold">
                                View Your Soldier →
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <p className="text-gray-400 minecraft-font pixel-loading">
                                Please wait, AI is creating your soldier
                            </p>
                        </div>
                    )}
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

                .minecraft-font {
                    font-family: 'Minecraft', monospace;
                }

                .progress-container {
                    height: 24px;
                    background-color: #222;
                    border: 2px solid #555;
                    padding: 4px;
                }

                .progress-bar {
                    height: 100%;
                    background: linear-gradient(to right, #3b82f6, #10b981);
                    transition: width 0.3s ease-out;
                }

                .chat-bubble {
                    border-left: 3px solid #3b82f6;
                    padding: 8px 12px;
                    background-color: rgba(59, 130, 246, 0.1);
                    margin-bottom: 16px;
                }

                .pixel-forge-animation {
                    width: 64px;
                    height: 64px;
                    background-color: #ff6600;
                    opacity: 0.8;
                    border-radius: 50%;
                    box-shadow: 0 0 30px 15px #ff6600;
                    animation: forge 1.5s infinite alternate;
                }

                .pixel-loading:after {
                    content: '...';
                    animation: loading 1.5s infinite;
                }

                .minecraft-btn-gold {
                    display: inline-block;
                    padding: 8px 16px;
                    font-size: 16px;
                    font-weight: bold;
                    text-transform: uppercase;
                    background-color: #ffaa00;
                    border: 3px solid #333;
                    color: white;
                    box-shadow: 3px 3px 0px #222;
                    position: relative;
                    transition: all 0.1s;
                    font-family: 'Press Start 2P', monospace;
                    letter-spacing: 1px;
                    cursor: pointer;
                }

                .minecraft-btn-gold:hover {
                    background-color: #ffbb33;
                    transform: translateY(-2px);
                }

                .minecraft-btn-gold:active {
                    background-color: #ee9900;
                    transform: translateY(2px);
                    box-shadow: 1px 1px 0px #222;
                }

                .pixelated {
                    image-rendering: pixelated;
                }

                @keyframes forge {
                    0% {
                        opacity: 0.6;
                        transform: scale(0.9);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1.1);
                    }
                }

                @keyframes loading {
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
