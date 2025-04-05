'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/wallet-context';

// 模擬用戶士兵數據
const MOCK_SOLDIERS = [
    {
        id: 1,
        name: 'Doge戰士',
        prompt: '一隻戴著太陽眼鏡的狗狗，背景是爆炸場景',
        attributes: {
            humor: 85,
            virality: 92,
            originality: 78,
            strength: 88,
        },
        tokenAmount: 450,
        image: '/placeholder-soldier.png',
        createdAt: '2023-04-05T12:30:00Z',
    },
    {
        id: 2,
        name: 'Pepe將軍',
        prompt: '穿著軍裝的青蛙，拿著指揮棒',
        attributes: {
            humor: 75,
            virality: 95,
            originality: 65,
            strength: 85,
        },
        tokenAmount: 320,
        image: '/placeholder-soldier.png',
        createdAt: '2023-04-05T14:15:00Z',
    },
];

export default function WalletPage() {
    const router = useRouter();
    const { isConnected, walletAddress, balance } = useWallet();
    const [soldiers, setSoldiers] = useState(MOCK_SOLDIERS);
    const [totalTokens, setTotalTokens] = useState(0);

    // 檢查錢包連接狀態
    useEffect(() => {
        if (!isConnected) {
            // 如果未連接錢包，重定向到首頁
            router.push('/');
        } else {
            // 計算總代幣數量
            const total = soldiers.reduce((sum, soldier) => sum + soldier.tokenAmount, 0);
            setTotalTokens(total);
        }
    }, [isConnected, router, soldiers]);

    // 如果未連接錢包，顯示加載中
    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-600">正在檢查錢包連接狀態...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-2xl font-bold mb-4">我的錢包</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded border">
                            <h2 className="text-lg font-medium mb-2">錢包資訊</h2>
                            <p className="text-gray-700 mb-1">地址: {walletAddress}</p>
                            <p className="text-gray-700 mb-1">餘額: {balance} CELO</p>
                            <p className="text-gray-700">Meme代幣: {totalTokens}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded border">
                            <h2 className="text-lg font-medium mb-2">士兵統計</h2>
                            <p className="text-gray-700 mb-1">總士兵類型: {soldiers.length}</p>
                            <p className="text-gray-700 mb-1">總士兵數量: {totalTokens}</p>
                            <p className="text-gray-700">
                                戰場上的士兵: {Math.floor(totalTokens / 2)}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/soldier-prep')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        創建新士兵
                    </button>
                </div>

                <h2 className="text-xl font-bold mb-4">我的士兵</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {soldiers.map((soldier) => (
                        <div
                            key={soldier.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            <div className="h-40 bg-gray-300 flex items-center justify-center">
                                {/* 實際項目中這裡應該是士兵圖像 */}
                                <div className="text-4xl">🐶</div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1">{soldier.name}</h3>
                                <p className="text-sm text-gray-600 mb-3">"{soldier.prompt}"</p>

                                <div className="mb-3">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>幽默值</span>
                                        <span>{soldier.attributes.humor}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${soldier.attributes.humor}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>傳播力</span>
                                        <span>{soldier.attributes.virality}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: `${soldier.attributes.virality}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-4">
                                    <span className="text-sm text-gray-600">
                                        持有: {soldier.tokenAmount} 代幣
                                    </span>
                                    <button className="text-blue-500 hover:text-blue-700 text-sm">
                                        部署到戰場
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
