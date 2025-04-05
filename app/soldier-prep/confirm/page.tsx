'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function ConfirmPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);

    useEffect(() => {
        const promptParam = searchParams.get('prompt');
        if (promptParam) {
            setPrompt(decodeURIComponent(promptParam));
        } else {
            // If no prompt parameter, return to input page
            router.push('/soldier-prep');
        }
    }, [searchParams, router]);

    const handleConfirm = () => {
        if (isAgreed && prompt) {
            // Navigate to generation page, continuing to pass the prompt parameter
            router.push(`/soldier-prep/generating?prompt=${encodeURIComponent(prompt)}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-10 px-4 pixel-bg">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-yellow-300 text-center minecraft-font uppercase tracking-wide">
                    CONFIRM SOLDIER GENERATION
                </h1>

                {/* Three-column layout */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    {/* Left sidebar: Blacksmith dialogue - 30% width */}
                    <div className="lg:w-[30%] order-2 lg:order-1">
                        <div className="pixel-border bg-black/80 p-4 h-full flex flex-col">
                            <div className="mb-4 flex justify-center">
                                <div className="pixel-character blacksmith w-16 h-16"></div>
                            </div>
                            <div className={`minecraft-dialog w-full ${isAgreed ? 'active' : ''}`}>
                                <p className="minecraft-font text-white text-sm">
                                    {isAgreed
                                        ? 'READY TO FORGE! PLEASE CONFIRM THE DETAILS...'
                                        : 'ARE YOU SURE YOU WANT TO FORGE THIS SOLDIER? 50% WILL BE DEPLOYED TO THE BATTLEFIELD!'}
                                </p>
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

                            <div className="mt-auto flex flex-col space-y-3">
                                <button
                                    onClick={handleConfirm}
                                    disabled={!isAgreed}
                                    className={
                                        isAgreed
                                            ? 'minecraft-btn w-full'
                                            : 'minecraft-btn-disabled w-full'
                                    }
                                >
                                    CONFIRM AND GENERATE →
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

                .pixel-character {
                    background-color: transparent;
                }

                .blacksmith {
                    background-image: url('/images/blacksmith.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                }
            `}</style>
        </div>
    );
}
