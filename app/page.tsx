'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useWallet } from '@/lib/wallet-context';
import { useRouter } from 'next/navigation';

export default function Home() {
    const { isConnected, connectWallet } = useWallet();
    const router = useRouter();

    // If wallet is connected, redirect to soldier prep page
    const handleWalletConnect = async () => {
        if (!isConnected) {
            await connectWallet();
        } else {
            router.push('/soldier-prep');
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-12">
            <div className="w-full max-w-4xl mx-auto text-center">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-yellow-300 drop-shadow-[2px_2px_0px_#000] pixel-text">
                    MemeWarriors
                </h1>
                <p className="text-xl mb-8 text-white drop-shadow-[1px_1px_0px_#000] pixel-text">
                    Create AI Meme Soldiers & Battle in the Pixel Arena!
                </p>

                <div className="pixel-border bg-black/60 backdrop-blur-sm p-6 mb-10">
                    <h2 className="text-2xl font-semibold mb-4 text-green-400 pixel-text">
                        Welcome to MemeWarriors
                    </h2>
                    <p className="mb-6 minecraft-font">
                        Build your meme army and conquer the pixel battlefields in this blocky
                        adventure!
                    </p>
                    <button
                        onClick={handleWalletConnect}
                        className="minecraft-btn text-white mb-4 mx-auto block"
                    >
                        {isConnected ? 'ENTER GAME' : 'CONNECT WALLET'}
                    </button>
                    <p className="text-sm text-gray-400 minecraft-font">
                        Requires a Celo-compatible wallet to continue
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="pixel-border bg-black/60 backdrop-blur-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-green-400 pixel-text">
                                ACTIVE BATTLEFIELDS
                            </h3>
                            <Image
                                src="/images/sword-icon.png"
                                alt="Battles"
                                width={32}
                                height={32}
                                className="pixelated"
                            />
                        </div>
                        <ul className="text-left minecraft-font">
                            <li className="mb-2">→ Active Arenas: 3</li>
                            <li className="mb-2">→ Total Soldiers: 1,234</li>
                            <li className="mb-2">→ New Recruits Today: 89</li>
                        </ul>
                    </div>
                    <div className="pixel-border bg-black/60 backdrop-blur-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-green-400 pixel-text">
                                TOP MEME SOLDIERS
                            </h3>
                            <Image
                                src="/images/trophy-icon.png"
                                alt="Winners"
                                width={32}
                                height={32}
                                className="pixelated"
                            />
                        </div>
                        <ul className="text-left minecraft-font">
                            <li className="mb-2">→ Doge Warrior - Win Rate 78%</li>
                            <li className="mb-2">→ Pepe General - Win Rate 65%</li>
                            <li className="mb-2">→ Wojak Scout - Win Rate 62%</li>
                        </ul>
                    </div>
                </div>

                <Link
                    href="/soldier-prep"
                    className="minecraft-btn block mx-auto text-white text-xl"
                >
                    CREATE YOUR MEME SOLDIER
                </Link>

                <div className="mt-10 grid grid-cols-3 gap-4 text-4xl">
                    <div className="pixel-border bg-black/60 backdrop-blur-sm p-4">🐶</div>
                    <div className="pixel-border bg-black/60 backdrop-blur-sm p-4">🐸</div>
                    <div className="pixel-border bg-black/60 backdrop-blur-sm p-4">🧔</div>
                </div>
            </div>
        </main>
    );
}
