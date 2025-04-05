'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/lib/wallet-context';

// 模擬戰鬥數據
const MOCK_BATTLES = [
    {
        id: 1,
        name: '像素競技場 #1',
        status: 'active',
        participants: [
            {
                id: 101,
                name: 'Doge戰士',
                prompt: '一隻戴著太陽眼鏡的狗狗，背景是爆炸場景',
                votes: 157,
                image: '/placeholder-soldier.png',
            },
            {
                id: 102,
                name: 'Pepe將軍',
                prompt: '穿著軍裝的青蛙，拿著指揮棒',
                votes: 143,
                image: '/placeholder-soldier.png',
            },
        ],
        startTime: '2023-04-05T12:00:00Z',
        endTime: '2023-04-05T18:00:00Z',
    },
    {
        id: 2,
        name: '幽默擂台 #2',
        status: 'active',
        participants: [
            {
                id: 201,
                name: 'Wojak偵察兵',
                prompt: '憂鬱表情的男子，穿著迷彩服',
                votes: 98,
                image: '/placeholder-soldier.png',
            },
            {
                id: 202,
                name: '貓咪將軍',
                prompt: '哭泣的貓咪戴著皇冠',
                votes: 124,
                image: '/placeholder-soldier.png',
            },
        ],
        startTime: '2023-04-05T14:30:00Z',
        endTime: '2023-04-05T20:30:00Z',
    },
    {
        id: 3,
        name: '傳播之戰 #3',
        status: 'upcoming',
        participants: [
            {
                id: 301,
                name: '宇航員戰士',
                prompt: '像素風格的宇航員在月球上跳舞',
                votes: 0,
                image: '/placeholder-soldier.png',
            },
            {
                id: 302,
                name: '恐龍執行官',
                prompt: '恐龍穿西裝在開會',
                votes: 0,
                image: '/placeholder-soldier.png',
            },
        ],
        startTime: '2023-04-05T22:00:00Z',
        endTime: '2023-04-06T04:00:00Z',
    },
];

export default function BattlefieldPage() {
    const router = useRouter();
    const { isConnected } = useWallet();
    const [battles, setBattles] = useState(MOCK_BATTLES);
    const [activeTab, setActiveTab] = useState('active'); // 'active', 'upcoming', 'completed'

    // 檢查錢包連接狀態
    useEffect(() => {
        if (!isConnected) {
            // 如果未連接錢包，重定向到首頁
            router.push('/');
        }
    }, [isConnected, router]);

    // 如果未連接錢包，顯示加載中
    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-600">正在檢查錢包連接狀態...</p>
            </div>
        );
    }

    // 篩選戰鬥
    const filteredBattles = battles.filter((battle) => {
        if (activeTab === 'active') return battle.status === 'active';
        if (activeTab === 'upcoming') return battle.status === 'upcoming';
        if (activeTab === 'completed') return battle.status === 'completed';
        return true;
    });

    // 計算剩餘時間
    const getRemainingTime = (endTimeString: string) => {
        const endTime = new Date(endTimeString).getTime();
        const now = new Date().getTime();
        const diff = endTime - now;

        if (diff <= 0) return '已結束';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}小時 ${minutes}分鐘`;
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">戰場</h1>
                    <Link
                        href="/soldier-prep"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        創建新士兵
                    </Link>
                </div>

                {/* 篩選標籤 */}
                <div className="flex border-b border-gray-300 mb-6">
                    <button
                        className={`px-4 py-2 ${activeTab === 'active' ? 'text-blue-500 border-b-2 border-blue-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('active')}
                    >
                        進行中
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'upcoming' ? 'text-blue-500 border-b-2 border-blue-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        即將開始
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'completed' ? 'text-blue-500 border-b-2 border-blue-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        已結束
                    </button>
                </div>

                {/* 戰鬥列表 */}
                <div className="grid grid-cols-1 gap-6">
                    {filteredBattles.length > 0 ? (
                        filteredBattles.map((battle) => (
                            <div
                                key={battle.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden"
                            >
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold">{battle.name}</h2>
                                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {battle.status === 'active'
                                                ? '進行中'
                                                : battle.status === 'upcoming'
                                                  ? '即將開始'
                                                  : '已結束'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {battle.status === 'active'
                                            ? `剩餘時間: ${getRemainingTime(battle.endTime)}`
                                            : battle.status === 'upcoming'
                                              ? `開始時間: ${new Date(battle.startTime).toLocaleString()}`
                                              : `結束時間: ${new Date(battle.endTime).toLocaleString()}`}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                                    {battle.participants.map((participant, index) => (
                                        <div key={participant.id} className="p-4 flex">
                                            <div className="w-20 h-20 bg-gray-200 flex items-center justify-center mr-4">
                                                {/* 實際項目中這裡應該是士兵圖像 */}
                                                <div className="text-3xl">
                                                    {index === 0 ? '🐶' : '🐸'}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold">
                                                    {participant.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {participant.prompt}
                                                </p>

                                                {battle.status === 'active' && (
                                                    <div className="mt-2">
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span>得票數</span>
                                                            <span>{participant.votes}</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`${index === 0 ? 'bg-blue-500' : 'bg-green-500'} h-2 rounded-full`}
                                                                style={{
                                                                    width: `${(participant.votes / (battle.participants[0].votes + battle.participants[1].votes)) * 100}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-gray-50 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            總投票數:{' '}
                                            {battle.participants.reduce(
                                                (sum, p) => sum + p.votes,
                                                0
                                            )}
                                        </span>

                                        {battle.status === 'active' && (
                                            <Link
                                                href={`/battlefield/${battle.id}`}
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
                                            >
                                                查看戰鬥
                                            </Link>
                                        )}

                                        {battle.status === 'upcoming' && (
                                            <button className="bg-gray-500 text-white text-sm px-4 py-2 rounded cursor-not-allowed">
                                                尚未開始
                                            </button>
                                        )}

                                        {battle.status === 'completed' && (
                                            <Link
                                                href={`/battlefield/${battle.id}/result`}
                                                className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
                                            >
                                                查看結果
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-600">
                                暫無
                                {activeTab === 'active'
                                    ? '進行中'
                                    : activeTab === 'upcoming'
                                      ? '即將開始'
                                      : '已結束'}
                                的戰鬥
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
