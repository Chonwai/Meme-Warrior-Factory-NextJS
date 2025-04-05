'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Simulated soldier attributes
const SOLDIER_ATTRIBUTES = {
    humor: 0,
    virality: 0,
    originality: 0,
    strength: 0,
};

export default function ResultPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [attributes, setAttributes] = useState(SOLDIER_ATTRIBUTES);
    const [tokenAmount, setTokenAmount] = useState(0);
    const [soldierImage, setSoldierImage] = useState('/images/soldier-placeholder.png');

    useEffect(() => {
        const promptParam = searchParams.get('prompt');
        if (promptParam) {
            setPrompt(decodeURIComponent(promptParam));

            // Simulate generating soldier attributes (should actually be obtained from AI service)
            setAttributes({
                humor: Math.floor(Math.random() * 100),
                virality: Math.floor(Math.random() * 100),
                originality: Math.floor(Math.random() * 100),
                strength: Math.floor(Math.random() * 100),
            });

            // Simulate token amount (should actually be obtained from smart contract)
            setTokenAmount(Math.floor(Math.random() * 1000) + 100);

            // In an actual project, we would get the real image URL here
        } else {
            // If no prompt parameter, return to input page
            router.push('/soldier-prep');
        }
    }, [searchParams, router]);

    const handleDeploy = () => {
        // Deploy to battlefield (should call smart contract in actual project)
        router.push('/battlefield');
    };

    const handleKeep = () => {
        // Save to wallet (should call smart contract in actual project)
        router.push('/wallet');
    };

    return (
        <div className="min-h-screen bg-gray-900 py-10 px-4 pixel-bg">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-yellow-300 text-center drop-shadow-[2px_2px_0px_#000] pixel-text">
                    Soldier Forged Successfully!
                </h1>

                {/* Pokemon style factory scene - deployment center */}
                <div className="relative w-full h-96 pixel-border overflow-hidden mb-8">
                    <div className="absolute inset-0">
                        <Image
                            src="/images/forge.png"
                            alt="Meme Forge"
                            fill
                            className="object-cover pixelated"
                        />
                    </div>

                    {/* Deployment area animation */}
                    <div className="absolute right-10 bottom-40 flex items-center">
                        <div className="teleport-pad"></div>
                        <div className="w-12 h-12 bg-transparent ml-4">
                            {/* Dispatcher image */}
                            <div className="pixel-character dispatcher"></div>
                        </div>
                    </div>

                    {/* Center display of generated soldier */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="soldier-container pixel-border bg-black/70 backdrop-blur-sm p-6">
                            <div className="flex flex-col md:flex-row">
                                <div className="soldier-image-container mb-4 md:mb-0 md:mr-6">
                                    {/* In an actual project, this would be the dynamically generated soldier image */}
                                    <div className="pixel-soldier">
                                        <Image
                                            src={soldierImage}
                                            alt="Meme Soldier"
                                            width={120}
                                            height={120}
                                            className="pixelated"
                                            onError={() => {
                                                // If image loading fails, use emoji instead
                                                const element =
                                                    document.querySelector('.pixel-soldier');
                                                if (element) {
                                                    element.innerHTML =
                                                        '<div class="fallback-emoji">🐶</div>';
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="soldier-stats">
                                    <h3 className="text-center font-bold mb-2 text-green-400 pixel-text">
                                        Your Meme Soldier
                                    </h3>
                                    <div className="stat-bar">
                                        <span className="minecraft-font text-white">Humor</span>
                                        <div className="bar-container">
                                            <div
                                                className="bar-fill"
                                                style={{ width: `${attributes.humor}%` }}
                                            ></div>
                                        </div>
                                        <span className="minecraft-font text-white">
                                            {attributes.humor}
                                        </span>
                                    </div>
                                    <div className="stat-bar">
                                        <span className="minecraft-font text-white">Virality</span>
                                        <div className="bar-container">
                                            <div
                                                className="bar-fill"
                                                style={{ width: `${attributes.virality}%` }}
                                            ></div>
                                        </div>
                                        <span className="minecraft-font text-white">
                                            {attributes.virality}
                                        </span>
                                    </div>
                                    <div className="stat-bar">
                                        <span className="minecraft-font text-white">
                                            Originality
                                        </span>
                                        <div className="bar-container">
                                            <div
                                                className="bar-fill"
                                                style={{ width: `${attributes.originality}%` }}
                                            ></div>
                                        </div>
                                        <span className="minecraft-font text-white">
                                            {attributes.originality}
                                        </span>
                                    </div>
                                    <div className="stat-bar">
                                        <span className="minecraft-font text-white">Strength</span>
                                        <div className="bar-container">
                                            <div
                                                className="bar-fill"
                                                style={{ width: `${attributes.strength}%` }}
                                            ></div>
                                        </div>
                                        <span className="minecraft-font text-white">
                                            {attributes.strength}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Control area */}
                <div className="pixel-border bg-black/70 backdrop-blur-sm p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4 text-green-400 pixel-text">
                        Forging Result
                    </h2>

                    <div className="mb-6 p-4 bg-gray-800 border-2 border-gray-700 rounded">
                        <h3 className="text-sm font-semibold mb-2 text-yellow-300 pixel-text">
                            Creative Prompt:
                        </h3>
                        <p className="text-gray-300 minecraft-font italic">&quot;{prompt}&quot;</p>
                    </div>

                    <div className="mb-6 p-4 bg-green-900/40 border-2 border-green-700 rounded">
                        <h3 className="text-sm font-semibold mb-2 text-green-400 pixel-text">
                            Generation Result:
                        </h3>
                        <p className="text-gray-300 minecraft-font">
                            Successfully forged{' '}
                            <span className="text-yellow-300 font-bold">{tokenAmount}</span> Meme
                            token soldiers!
                        </p>
                        <div className="mt-3 space-y-2">
                            <p className="text-gray-300 minecraft-font flex items-center">
                                <span className="text-yellow-500 mr-2">→</span>
                                <span>
                                    {Math.floor(tokenAmount / 2)} soldiers ready to deploy to
                                    battlefield
                                </span>
                            </p>
                            <p className="text-gray-300 minecraft-font flex items-center">
                                <span className="text-yellow-500 mr-2">→</span>
                                <span>
                                    {Math.ceil(tokenAmount / 2)} soldiers can be saved in your
                                    wallet
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button onClick={handleDeploy} className="minecraft-btn-red">
                            Deploy to Battlefield
                        </button>

                        <button onClick={handleKeep} className="minecraft-btn">
                            View My Wallet
                        </button>
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

                .pixel-text {
                    font-family: 'Press Start 2P', monospace;
                    letter-spacing: 1px;
                }

                .minecraft-font {
                    font-family: 'Minecraft', monospace;
                }

                .teleport-pad {
                    width: 64px;
                    height: 24px;
                    background-color: #3b82f6;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                    box-shadow: 0 0 15px 5px #3b82f6;
                }

                .soldier-container {
                    max-width: 90%;
                }

                .soldier-image-container {
                    width: 120px;
                    height: 120px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .pixel-soldier {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: rgba(0, 0, 0, 0.3);
                    border: 2px solid #555;
                }

                .fallback-emoji {
                    font-size: 64px;
                    text-align: center;
                }

                .soldier-stats {
                    flex: 1;
                }

                .stat-bar {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                    font-size: 12px;
                }

                .bar-container {
                    flex: 1;
                    height: 12px;
                    background-color: #222;
                    border: 2px solid #555;
                    margin: 0 8px;
                    padding: 2px;
                }

                .bar-fill {
                    height: 100%;
                    background: linear-gradient(to right, #3b82f6, #10b981);
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

                .minecraft-btn-red {
                    display: inline-block;
                    padding: 8px 16px;
                    font-size: 16px;
                    font-weight: bold;
                    text-transform: uppercase;
                    background-color: #c43c3c;
                    border: 3px solid #333;
                    color: white;
                    box-shadow: 3px 3px 0px #222;
                    position: relative;
                    transition: all 0.1s;
                    font-family: 'Press Start 2P', monospace;
                    letter-spacing: 1px;
                    cursor: pointer;
                }

                .minecraft-btn-red:hover {
                    background-color: #d65c5c;
                    transform: translateY(-2px);
                }

                .minecraft-btn-red:active {
                    background-color: #b33030;
                    transform: translateY(2px);
                    box-shadow: 1px 1px 0px #222;
                }

                .pixel-character {
                    width: 32px;
                    height: 32px;
                    background-color: transparent;
                }

                .dispatcher {
                    background-image: url('/images/dispatcher.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                }

                .pixelated {
                    image-rendering: pixelated;
                }

                @keyframes pulse {
                    0% {
                        opacity: 0.6;
                        transform: scale(0.95);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    100% {
                        opacity: 0.6;
                        transform: scale(0.95);
                    }
                }
            `}</style>
        </div>
    );
}
