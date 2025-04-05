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
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-yellow-300 text-center drop-shadow-[2px_2px_0px_#000] pixel-text">
                    Confirm Soldier Generation
                </h1>

                {/* Pokemon style factory scene - forge furnace */}
                <div className="relative w-full h-96 pixel-border overflow-hidden mb-8">
                    <div className="absolute inset-0">
                        <Image
                            src="/images/forge.png"
                            alt="Meme Forge"
                            fill
                            className="object-cover pixelated"
                        />
                    </div>

                    {/* Blacksmith and dialog box */}
                    <div className="absolute right-6 top-12 flex items-start">
                        <div className={`minecraft-dialog ${isAgreed ? 'active' : ''}`}>
                            <p className="text-sm">
                                {isAgreed
                                    ? 'Ready to forge! Please confirm the details...'
                                    : 'Are you sure you want to forge this soldier? 50% will be deployed to the battlefield!'}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-transparent ml-2">
                            {/* Blacksmith image */}
                            <div className="pixel-character blacksmith"></div>
                        </div>
                    </div>
                </div>

                {/* Confirmation area */}
                <div className="pixel-border bg-black/70 backdrop-blur-sm p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4 text-green-400 pixel-text">
                        Confirm Forging Details
                    </h2>

                    <div className="mb-6 p-4 bg-gray-800 border-2 border-gray-700 rounded">
                        <h3 className="text-sm font-semibold mb-2 text-yellow-300 pixel-text">
                            Your Creative Prompt:
                        </h3>
                        <p className="text-gray-300 minecraft-font italic">&quot;{prompt}&quot;</p>
                    </div>

                    <div className="mb-6 p-4 bg-yellow-900/40 border-2 border-yellow-700 rounded">
                        <h3 className="text-sm font-semibold mb-2 text-yellow-300 pixel-text">
                            Please Note:
                        </h3>
                        <ul className="list-none pl-0 space-y-2 text-sm text-gray-300 minecraft-font">
                            <li className="flex items-start">
                                <span className="text-yellow-500 mr-2">→</span>
                                <span>
                                    50% of the generated tokens will be automatically deployed to
                                    the battlefield
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-yellow-500 mr-2">→</span>
                                <span>Deployed soldiers may be lost in battle</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-yellow-500 mr-2">→</span>
                                <span>The remaining 50% will be saved in your wallet</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-yellow-500 mr-2">→</span>
                                <span>Each generation will consume a small amount of gas fees</span>
                            </li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <label className="flex items-start cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={isAgreed}
                                onChange={() => setIsAgreed(!isAgreed)}
                                className="mt-1 mr-3 h-5 w-5 cursor-pointer"
                            />
                            <span className="text-sm text-gray-300 group-hover:text-gray-200 minecraft-font">
                                I agree to deploy 50% of the tokens to the battlefield and
                                understand these tokens may be lost in battle.
                            </span>
                        </label>
                    </div>

                    <div className="flex justify-between">
                        <Link href="/soldier-prep" className="minecraft-btn-secondary">
                            ← Back to Edit
                        </Link>

                        <button
                            onClick={handleConfirm}
                            disabled={!isAgreed}
                            className={isAgreed ? 'minecraft-btn' : 'minecraft-btn-disabled'}
                        >
                            Confirm and Generate →
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

                .minecraft-dialog {
                    background-color: rgba(0, 0, 0, 0.7);
                    border: 2px solid #555;
                    padding: 8px 12px;
                    border-radius: 2px;
                    color: white;
                    position: relative;
                    max-width: 250px;
                }

                .minecraft-dialog:after {
                    content: '';
                    position: absolute;
                    right: -8px;
                    top: 10px;
                    border-top: 6px solid transparent;
                    border-bottom: 6px solid transparent;
                    border-left: 8px solid #555;
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

                .minecraft-btn-secondary {
                    display: inline-block;
                    padding: 8px 16px;
                    font-size: 16px;
                    font-weight: bold;
                    text-transform: uppercase;
                    background-color: #777;
                    border: 3px solid #333;
                    color: white;
                    box-shadow: 3px 3px 0px #222;
                    position: relative;
                    transition: all 0.1s;
                    font-family: 'Press Start 2P', monospace;
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
                    font-size: 16px;
                    font-weight: bold;
                    text-transform: uppercase;
                    background-color: #656565;
                    border: 3px solid #333;
                    color: #999;
                    box-shadow: 3px 3px 0px #222;
                    position: relative;
                    font-family: 'Press Start 2P', monospace;
                    letter-spacing: 1px;
                    cursor: not-allowed;
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
