'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/lib/wallet-context';
import { useWorldID } from '@/lib/world-id-context';
import NetworkIndicator from '@/components/NetworkIndicator';

export default function Navbar() {
    const pathname = usePathname();
    const { isConnected, walletAddress, balance, connectWallet, disconnectWallet, networkInfo } =
        useWallet();
    const { isWorldIDVerified, isVerifying, verifyWithWorldID } = useWorldID();

    // Check if current path is homepage
    const isHomePage = pathname === '/';

    // Don't show navbar on homepage
    if (isHomePage) return null;

    return (
        <header className="bg-gray-800 border-b-4 border-gray-700 text-white p-3">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <Link
                        href="/"
                        className="text-xl minecraft-font font-bold text-yellow-300 mr-6"
                    >
                        MemeWarriors
                    </Link>

                    <nav className="hidden md:flex space-x-4">
                        <Link
                            href="/soldier-prep"
                            className={`px-3 py-1 minecraft-font ${pathname && pathname.includes('/soldier-prep') ? 'bg-blue-600' : 'hover:bg-gray-700'} rounded`}
                        >
                            Create Soldier
                        </Link>
                        <Link
                            href="/battlefield"
                            className={`px-3 py-1 minecraft-font ${pathname && pathname.includes('/battlefield') ? 'bg-blue-600' : 'hover:bg-gray-700'} rounded`}
                        >
                            Battlefield
                        </Link>
                        <Link
                            href="/wallet"
                            className={`px-3 py-1 minecraft-font ${pathname && pathname.includes('/wallet') ? 'bg-blue-600' : 'hover:bg-gray-700'} rounded`}
                        >
                            My Wallet
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center space-x-3">
                    {isConnected && <NetworkIndicator />}

                    {isConnected ? (
                        <div className="flex items-center">
                            <div className="mr-3 text-sm minecraft-font">
                                <div className="text-yellow-300">
                                    {balance}{' '}
                                    {networkInfo?.nativeCurrency?.symbol ||
                                        (networkInfo?.chainId === '0x221' ? 'FLOW' : 'CELO')}
                                </div>
                                <div className="text-gray-400 text-xs">{walletAddress}</div>
                            </div>
                            {isWorldIDVerified ? (
                                <div className="bg-purple-600 px-3 py-1 rounded text-sm minecraft-font flex items-center mr-2 md:hidden">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Verified with World ID
                                </div>
                            ) : (
                                <button
                                    onClick={verifyWithWorldID}
                                    disabled={isVerifying}
                                    className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm minecraft-font mr-2 disabled:opacity-50 md:hidden"
                                >
                                    {isVerifying ? 'Verifying...' : 'Verify with World ID'}
                                </button>
                            )}
                            <button
                                onClick={disconnectWallet}
                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm minecraft-font"
                            >
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <div className="flex space-x-2">
                            <button
                                onClick={verifyWithWorldID}
                                disabled={isVerifying}
                                className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded minecraft-font disabled:opacity-50 md:hidden"
                            >
                                {isVerifying ? 'Verifying...' : 'Verify with World ID'}
                            </button>
                            <button
                                onClick={connectWallet}
                                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded minecraft-font"
                            >
                                Connect Wallet
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
