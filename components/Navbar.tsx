'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/lib/wallet-context';

export default function Navbar() {
    const pathname = usePathname();
    const { isConnected, walletAddress, balance, connectWallet, disconnectWallet } = useWallet();

    // 簡單檢查當前路徑是否是首頁
    const isHomePage = pathname === '/';

    // 如果是首頁，則不顯示導航欄
    if (isHomePage) return null;

    return (
        <header className="bg-gray-800 border-b-4 border-gray-700 text-white p-3">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/" className="text-xl font-bold text-yellow-300 mr-6">
                        MemeWarriors
                    </Link>

                    <nav className="hidden md:flex space-x-4">
                        <Link
                            href="/soldier-prep"
                            className={`px-3 py-1 ${pathname.includes('/soldier-prep') ? 'bg-blue-600' : 'hover:bg-gray-700'} rounded`}
                        >
                            士兵生成
                        </Link>
                        <Link
                            href="/battlefield"
                            className={`px-3 py-1 ${pathname.includes('/battlefield') ? 'bg-blue-600' : 'hover:bg-gray-700'} rounded`}
                        >
                            戰場
                        </Link>
                        <Link
                            href="/wallet"
                            className={`px-3 py-1 ${pathname.includes('/wallet') ? 'bg-blue-600' : 'hover:bg-gray-700'} rounded`}
                        >
                            我的錢包
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center">
                    {isConnected ? (
                        <div className="flex items-center">
                            <div className="mr-3 text-sm">
                                <div className="text-yellow-300">{balance} CELO</div>
                                <div className="text-gray-400 text-xs">{walletAddress}</div>
                            </div>
                            <button
                                onClick={disconnectWallet}
                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                            >
                                斷開連接
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={connectWallet}
                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                        >
                            連接錢包
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
