'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useWallet } from '@/lib/wallet-context';
import VoteButton from '@/components/VoteButton';
import { getUserVote } from '@/utils/web3';

// 模擬戰鬥數據
const MOCK_BATTLES = [
    {
        id: 1,
        name: 'PIXEL ARENA #1',
        status: 'active',
        participants: [
            {
                id: 101,
                name: 'DOGE WARRIOR',
                prompt: 'A dog wearing sunglasses with an explosion in the background',
                votes: 157,
                image: '/images/meme-soldier.png',
                burned: 0,
            },
            {
                id: 102,
                name: 'FROG GENERAL',
                prompt: 'A frog wearing military uniform with a commander stick',
                votes: 143,
                image: '/images/dispatcher.png',
                burned: 0,
            },
        ],
        startTime: '2023-04-05T12:00:00Z',
        endTime: '2023-04-05T18:00:00Z',
    },
    {
        id: 2,
        name: 'HUMOR ARENA #2',
        status: 'active',
        participants: [
            {
                id: 201,
                name: 'WOJAK SCOUT',
                prompt: 'A sad man wearing camouflage uniform',
                votes: 98,
                image: '/images/blacksmith.png',
                burned: 0,
            },
            {
                id: 202,
                name: 'CAT GENERAL',
                prompt: 'A crying cat wearing a crown',
                votes: 124,
                image: '/images/mad-scientist.png',
                burned: 0,
            },
        ],
        startTime: '2023-04-05T14:30:00Z',
        endTime: '2023-04-05T20:30:00Z',
    },
    {
        id: 3,
        name: 'VIRAL WAR #3',
        status: 'upcoming',
        participants: [
            {
                id: 301,
                name: 'ASTRONAUT WARRIOR',
                prompt: 'Pixel-style astronaut dancing on the moon',
                votes: 0,
                image: '/images/meme-soldier.png',
                burned: 0,
            },
            {
                id: 302,
                name: 'DINOSAUR CEO',
                prompt: 'A dinosaur in a suit at a meeting',
                votes: 0,
                image: '/images/blacksmith.png',
                burned: 0,
            },
        ],
        startTime: '2023-04-05T22:00:00Z',
        endTime: '2023-04-06T04:00:00Z',
    },
    {
        id: 4,
        name: 'PIXEL SHOWDOWN #4',
        status: 'completed',
        participants: [
            {
                id: 401,
                name: 'LASER CAT',
                prompt: 'A cat shooting lasers from its eyes',
                votes: 203,
                image: '/images/meme-soldier.png',
                burned: 12,
            },
            {
                id: 402,
                name: 'ZOMBIE PEPE',
                prompt: 'A zombie frog with glowing eyes',
                votes: 178,
                image: '/images/dispatcher.png',
                burned: 25,
            },
        ],
        startTime: '2023-04-03T10:00:00Z',
        endTime: '2023-04-04T10:00:00Z',
        winner: 401,
    },
];

export default function BattlefieldPage() {
    const router = useRouter();
    const { isConnected } = useWallet();
    const [battles, setBattles] = useState(MOCK_BATTLES);
    const [activeTab, setActiveTab] = useState('active'); // 'active', 'upcoming', 'completed'
    const [selectedBattle, setSelectedBattle] = useState(MOCK_BATTLES[0]);
    const [votedFor, setVotedFor] = useState<number | null>(null);
    const [recentVotedTeam, setRecentVotedTeam] = useState<number | null>(null);
    const [showBurnAnimation, setShowBurnAnimation] = useState(false);

    // 檢查錢包連接狀態
    useEffect(() => {
        if (!isConnected) {
            // 如果未連接錢包，重定向到首頁
            router.push('/');
        }
    }, [isConnected, router]);

    useEffect(() => {
        // 模擬獲取戰鬥數據
        setBattles(MOCK_BATTLES);
        if (MOCK_BATTLES.length > 0) {
            setSelectedBattle(MOCK_BATTLES[0]);

            // 檢查用戶是否已投票
            const checkUserVote = async () => {
                try {
                    if (isConnected) {
                        const votedTeamId = await getUserVote(MOCK_BATTLES[0].id);
                        if (votedTeamId > 0) {
                            setVotedFor(votedTeamId);
                        }
                    }
                } catch (error) {
                    console.error('檢查用戶投票狀態失敗:', error);
                }
            };

            checkUserVote();
        }
    }, [isConnected]);

    // 生成隨機燃燒值，確保輸方燃燒值始終大於贏方
    const generateBurnValues = (battle: any) => {
        if (battle.status !== 'completed') {
            // 如果戰鬥不是已完成狀態，則將戰鬥標記為已完成並設置贏家和燃燒值
            const winner =
                battle.participants[0].votes > battle.participants[1].votes
                    ? battle.participants[0].id
                    : battle.participants[1].id;

            // 找出贏家和輸家
            const winnerIndex = battle.participants.findIndex((p: any) => p.id === winner);
            const loserIndex = winnerIndex === 0 ? 1 : 0;

            // 贏家的燃燒值為5-15之間的隨機數
            const winnerBurn = Math.floor(Math.random() * 11) + 5;

            // 輸家的燃燒值為贏家燃燒值的1.5-2.5倍
            const loserBurnMultiplier = 1.5 + Math.random();
            const loserBurn = Math.floor(winnerBurn * loserBurnMultiplier);

            // 更新戰鬥數據
            const updatedBattle = {
                ...battle,
                status: 'completed',
                winner: winner,
                participants: battle.participants.map((p: any, index: number) => ({
                    ...p,
                    burned: index === winnerIndex ? winnerBurn : loserBurn,
                })),
            };

            // 更新戰鬥列表
            setBattles(battles.map((b) => (b.id === battle.id ? updatedBattle : b)));

            // 如果當前選中的戰鬥是被更新的戰鬥，則更新選中的戰鬥
            if (selectedBattle.id === battle.id) {
                setSelectedBattle(updatedBattle);
            }

            // 顯示燃燒動畫
            setShowBurnAnimation(true);
            setTimeout(() => setShowBurnAnimation(false), 3000);

            return updatedBattle;
        }

        return battle;
    };

    // 手動結束戰鬥並生成燃燒值
    const endBattle = (battle: any) => {
        if (battle.status === 'active') {
            return generateBurnValues(battle);
        }
        return battle;
    };

    // 如果未連接錢包，顯示加載中
    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <p className="minecraft-font text-xl text-gray-300">
                    Checking wallet connection status...
                </p>
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

        if (diff <= 0) return 'ENDED';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}H ${minutes}M`;
    };

    // 處理投票
    const handleVote = (battleId: number, teamId: number) => {
        setVotedFor(teamId);

        // 設置最近投票的隊伍以顯示動畫
        setRecentVotedTeam(teamId);

        // 2秒後清除動畫效果
        setTimeout(() => {
            setRecentVotedTeam(null);
        }, 2000);

        // 更新投票數據
        setBattles(
            battles.map((battle) => {
                if (battle.id === battleId) {
                    return {
                        ...battle,
                        participants: battle.participants.map((p) => {
                            if (p.id === teamId) {
                                return { ...p, votes: p.votes + 1 };
                            }
                            return p;
                        }),
                    };
                }
                return battle;
            })
        );
    };

    // 選擇查看的戰鬥
    const handleSelectBattle = (battle: any) => {
        setSelectedBattle(battle);
        setVotedFor(null); // 重置投票狀態
    };

    return (
        <div className="min-h-screen bg-gray-900 py-10 px-4 pixel-bg">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-yellow-300 text-center minecraft-font uppercase tracking-wide">
                    MEME BATTLEFIELD
                </h1>

                {/* Three-column layout */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    {/* Left sidebar: Battle list - 30% width */}
                    <div className="lg:w-[30%] order-1">
                        <div className="pixel-border bg-black/80 p-4 h-full flex flex-col">
                            <div className="flex border-b border-gray-700 mb-4">
                                <button
                                    className={`px-4 py-2 minecraft-font text-sm ${activeTab === 'active' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-gray-300'}`}
                                    onClick={() => setActiveTab('active')}
                                >
                                    IN PROGRESS
                                </button>
                                <button
                                    className={`px-4 py-2 minecraft-font text-sm ${activeTab === 'upcoming' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-gray-300'}`}
                                    onClick={() => setActiveTab('upcoming')}
                                >
                                    UPCOMING
                                </button>
                                <button
                                    className={`px-4 py-2 minecraft-font text-sm ${activeTab === 'completed' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-gray-300'}`}
                                    onClick={() => setActiveTab('completed')}
                                >
                                    ENDED
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto space-y-3">
                                {filteredBattles.length > 0 ? (
                                    filteredBattles.map((battle) => (
                                        <div
                                            key={battle.id}
                                            className={`p-3 border-2 ${
                                                selectedBattle.id === battle.id
                                                    ? 'border-yellow-500 bg-gray-800'
                                                    : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                                            } cursor-pointer transition-colors`}
                                            onClick={() => handleSelectBattle(battle)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <h2 className="text-md font-bold text-white minecraft-font">
                                                    {battle.name}
                                                </h2>
                                                <span
                                                    className={`text-xs px-2 py-1 minecraft-font ${
                                                        battle.status === 'active'
                                                            ? 'bg-green-900/50 text-green-400'
                                                            : battle.status === 'upcoming'
                                                              ? 'bg-blue-900/50 text-blue-400'
                                                              : 'bg-red-900/50 text-red-400'
                                                    }`}
                                                >
                                                    {battle.status === 'active'
                                                        ? 'ACTIVE'
                                                        : battle.status === 'upcoming'
                                                          ? 'UPCOMING'
                                                          : 'ENDED'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between mt-2">
                                                <div className="flex items-center space-x-1">
                                                    <div className="w-6 h-6 bg-gray-700 flex items-center justify-center">
                                                        <span className="text-xs">👥</span>
                                                    </div>
                                                    <span className="text-xs text-gray-300 minecraft-font">
                                                        {battle.participants.length} SOLDIERS
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-300 minecraft-font">
                                                    {battle.status === 'active' && (
                                                        <span className="text-yellow-300">
                                                            ⏱️ {getRemainingTime(battle.endTime)}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>

                                            {/* 添加進入戰場按鈕 */}
                                            <div className="flex justify-end mt-3 minecraft-font">
                                                <Link
                                                    href={`/battlefield/${battle.id}`}
                                                    className="battle-link minecraft-font text-xs text-yellow-400 hover:text-yellow-300"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    ENTER ARENA →
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-400 minecraft-font p-4">
                                        NO BATTLES FOUND
                                    </div>
                                )}
                            </div>
                            <Link href="/soldier-prep" className="minecraft-btn w-full text-center">
                                CREATE NEW SOLDIER
                            </Link>
                        </div>
                    </div>

                    {/* Middle column: Battle arena - 40% width */}
                    <div className="lg:w-[40%] order-2">
                        <div
                            className="relative pixel-border overflow-hidden"
                            style={{ height: '70vh' }}
                        >
                            <div className="absolute inset-0">
                                <Image
                                    src="/images/dirt-bg.png"
                                    alt="Battle Arena"
                                    fill
                                    className="object-cover pixelated opacity-40"
                                />
                            </div>

                            {selectedBattle && (
                                <div className="absolute inset-0 flex flex-col items-center">
                                    <div className="text-center mt-6 mb-4">
                                        <h2 className="text-2xl text-yellow-300 minecraft-font uppercase">
                                            {selectedBattle.name}
                                        </h2>
                                        {selectedBattle.status === 'active' && (
                                            <div className="text-sm text-white minecraft-font mt-1">
                                                TIME REMAINING:{' '}
                                                {getRemainingTime(selectedBattle.endTime)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex w-full justify-between px-8 mt-6">
                                        {/* Left participant */}
                                        <div className="flex flex-col items-center">
                                            <div className="relative mb-2">
                                                <div
                                                    className="pixel-border overflow-hidden"
                                                    style={{ width: '100px', height: '100px' }}
                                                >
                                                    <Image
                                                        src={selectedBattle.participants[0].image}
                                                        alt={selectedBattle.participants[0].name}
                                                        width={100}
                                                        height={100}
                                                        className="pixelated"
                                                    />
                                                </div>
                                                {votedFor === selectedBattle.participants[0].id && (
                                                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 minecraft-font">
                                                        VOTED
                                                    </div>
                                                )}
                                                {selectedBattle.status === 'completed' && (
                                                    <div
                                                        className={`absolute -bottom-2 -right-2 ${selectedBattle.winner === selectedBattle.participants[0].id ? 'bg-yellow-500' : 'bg-red-500'} text-white text-xs px-1 minecraft-font flex items-center`}
                                                    >
                                                        {selectedBattle.winner ===
                                                        selectedBattle.participants[0].id
                                                            ? 'WINNER'
                                                            : 'LOSER'}
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-md font-bold text-white minecraft-font text-center">
                                                {selectedBattle.participants[0].name}
                                            </h3>
                                            <div className="text-xs text-gray-300 minecraft-font text-center mt-1 max-w-[120px]">
                                                {selectedBattle.participants[0].prompt}
                                            </div>

                                            {selectedBattle.status === 'active' && !votedFor && (
                                                <VoteButton
                                                    battleId={selectedBattle.id}
                                                    teamId={selectedBattle.participants[0].id}
                                                    onVoteSuccess={handleVote}
                                                    className="mt-3 text-xs"
                                                />
                                            )}
                                        </div>

                                        {/* VS */}
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="text-3xl text-red-500 minecraft-font font-bold">
                                                VS
                                            </div>
                                            {selectedBattle.status === 'active' && (
                                                <div className="battle-effect mt-4"></div>
                                            )}
                                        </div>

                                        {/* Right participant */}
                                        <div className="flex flex-col items-center">
                                            <div className="relative mb-2">
                                                <div
                                                    className="pixel-border overflow-hidden"
                                                    style={{ width: '100px', height: '100px' }}
                                                >
                                                    <Image
                                                        src={selectedBattle.participants[1].image}
                                                        alt={selectedBattle.participants[1].name}
                                                        width={100}
                                                        height={100}
                                                        className="pixelated"
                                                    />
                                                </div>
                                                {votedFor === selectedBattle.participants[1].id && (
                                                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 minecraft-font">
                                                        VOTED
                                                    </div>
                                                )}
                                                {selectedBattle.status === 'completed' && (
                                                    <div
                                                        className={`absolute -bottom-2 -right-2 ${selectedBattle.winner === selectedBattle.participants[1].id ? 'bg-yellow-500' : 'bg-red-500'} text-white text-xs px-1 minecraft-font flex items-center`}
                                                    >
                                                        {selectedBattle.winner ===
                                                        selectedBattle.participants[1].id
                                                            ? 'WINNER'
                                                            : 'LOSER'}
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-md font-bold text-white minecraft-font text-center">
                                                {selectedBattle.participants[1].name}
                                            </h3>
                                            <div className="text-xs text-gray-300 minecraft-font text-center mt-1 max-w-[120px]">
                                                {selectedBattle.participants[1].prompt}
                                            </div>

                                            {selectedBattle.status === 'active' && !votedFor && (
                                                <VoteButton
                                                    battleId={selectedBattle.id}
                                                    teamId={selectedBattle.participants[1].id}
                                                    onVoteSuccess={handleVote}
                                                    className="mt-3 text-xs"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Battle progress bar */}
                                    {selectedBattle.status === 'active' && (
                                        <div className="w-4/5 mt-8">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-blue-300 minecraft-font relative">
                                                    {selectedBattle.participants[0].votes} VOTES
                                                    {recentVotedTeam ===
                                                        selectedBattle.participants[0].id && (
                                                        <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-yellow-300 vote-animation">
                                                            +1
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="text-green-300 minecraft-font relative">
                                                    {selectedBattle.participants[1].votes} VOTES
                                                    {recentVotedTeam ===
                                                        selectedBattle.participants[1].id && (
                                                        <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-yellow-300 vote-animation">
                                                            +1
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                            <div className="relative h-6 bg-gray-800 border-2 border-gray-600">
                                                <div
                                                    className="absolute h-full bg-blue-600"
                                                    style={{
                                                        width: `${(selectedBattle.participants[0].votes / (selectedBattle.participants[0].votes + selectedBattle.participants[1].votes)) * 100}%`,
                                                    }}
                                                ></div>
                                                <div
                                                    className="absolute h-full bg-green-600 right-0"
                                                    style={{
                                                        width: `${(selectedBattle.participants[1].votes / (selectedBattle.participants[0].votes + selectedBattle.participants[1].votes)) * 100}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 戰鬥結束後，顯示燃燒數值 */}
                                    {selectedBattle.status === 'completed' && (
                                        <div className="w-4/5 mt-8">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-blue-300 minecraft-font">
                                                    {selectedBattle.participants[0].votes} VOTES
                                                </span>
                                                <span className="text-green-300 minecraft-font">
                                                    {selectedBattle.participants[1].votes} VOTES
                                                </span>
                                            </div>
                                            <div className="relative h-6 bg-gray-800 border-2 border-gray-600">
                                                <div
                                                    className="absolute h-full bg-blue-600"
                                                    style={{
                                                        width: `${(selectedBattle.participants[0].votes / (selectedBattle.participants[0].votes + selectedBattle.participants[1].votes)) * 100}%`,
                                                    }}
                                                ></div>
                                                <div
                                                    className="absolute h-full bg-green-600 right-0"
                                                    style={{
                                                        width: `${(selectedBattle.participants[1].votes / (selectedBattle.participants[0].votes + selectedBattle.participants[1].votes)) * 100}%`,
                                                    }}
                                                ></div>
                                            </div>

                                            {/* 燃燒數值顯示 */}
                                            <div className="flex justify-between mt-4 mb-2">
                                                <div className="text-center relative">
                                                    <span className="block text-red-500 minecraft-font text-xl font-bold">
                                                        🔥 {selectedBattle.participants[0].burned}
                                                        {showBurnAnimation &&
                                                            selectedBattle.participants[0].burned >
                                                                0 && (
                                                                <span className="burn-animation-large">
                                                                    🔥
                                                                </span>
                                                            )}
                                                    </span>
                                                    <span className="text-xs text-red-400 minecraft-font">
                                                        BURNED
                                                    </span>
                                                </div>

                                                <div className="text-center relative">
                                                    <span className="block text-red-500 minecraft-font text-xl font-bold">
                                                        🔥 {selectedBattle.participants[1].burned}
                                                        {showBurnAnimation &&
                                                            selectedBattle.participants[1].burned >
                                                                0 && (
                                                                <span className="burn-animation-large">
                                                                    🔥
                                                                </span>
                                                            )}
                                                    </span>
                                                    <span className="text-xs text-red-400 minecraft-font">
                                                        BURNED
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="relative h-4 bg-gray-800 border-2 border-gray-600 mt-1">
                                                <div
                                                    className="absolute h-full bg-red-600"
                                                    style={{
                                                        width: `${(selectedBattle.participants[0].burned / (selectedBattle.participants[0].burned + selectedBattle.participants[1].burned)) * 100}%`,
                                                    }}
                                                ></div>
                                                <div
                                                    className="absolute h-full bg-red-900 right-0"
                                                    style={{
                                                        width: `${(selectedBattle.participants[1].burned / (selectedBattle.participants[0].burned + selectedBattle.participants[1].burned)) * 100}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 添加查看戰鬥詳情按鈕 */}
                                    <div className="mt-8 minecraft-font">
                                        {selectedBattle.status === 'active' ? (
                                            <Link
                                                href={`/battlefield/${selectedBattle.id}`}
                                                className="minecraft-btn-red minecraft-font"
                                            >
                                                ENTER BATTLE ARENA
                                            </Link>
                                        ) : selectedBattle.status === 'completed' ? (
                                            <div className="text-center">
                                                <div className="text-green-400 minecraft-font mb-2">
                                                    BATTLE ENDED
                                                </div>
                                                <Link
                                                    href={`/battlefield/${selectedBattle.id}`}
                                                    className="minecraft-btn-blue minecraft-font"
                                                >
                                                    VIEW DETAILS
                                                </Link>
                                            </div>
                                        ) : (
                                            <Link
                                                href={`/battlefield/${selectedBattle.id}`}
                                                className="minecraft-btn-red minecraft-font"
                                            >
                                                ENTER BATTLE ARENA
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right sidebar: Rankings - 30% width */}
                    <div className="lg:w-[30%] order-3">
                        <div className="pixel-border bg-black/80 p-4 h-full flex flex-col">
                            <h2 className="text-xl font-bold mb-4 text-green-400 minecraft-font uppercase text-center">
                                LEADERBOARD
                            </h2>

                            <div className="mb-3 p-2 bg-yellow-900/30 border-2 border-yellow-700">
                                <h3 className="text-sm font-semibold mb-2 text-yellow-300 minecraft-font">
                                    TOTAL VOTERS:{' '}
                                    {selectedBattle.participants.reduce(
                                        (sum, p) => sum + p.votes,
                                        0
                                    )}
                                </h3>
                                <div className="space-y-1 text-xs text-gray-300 minecraft-font">
                                    <p className="flex items-center">
                                        <span className="text-yellow-500 mr-2">→</span>
                                        <span>TOP VOTERS GET REWARDS</span>
                                    </p>
                                    <p className="flex items-center">
                                        <span className="text-yellow-500 mr-2">→</span>
                                        <span>WINNING MEMES GET PROMOTED</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex-grow overflow-y-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-700">
                                            <th className="text-left py-2 text-xs text-gray-400 minecraft-font">
                                                RANK
                                            </th>
                                            <th className="text-left py-2 text-xs text-gray-400 minecraft-font">
                                                SOLDIER
                                            </th>
                                            <th className="text-right py-2 text-xs text-gray-400 minecraft-font">
                                                VOTES
                                            </th>
                                            {activeTab === 'completed' && (
                                                <th className="text-right py-2 text-xs text-red-400 minecraft-font">
                                                    BURNED
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...MOCK_BATTLES.flatMap((b) => b.participants)]
                                            .sort((a, b) => b.votes - a.votes)
                                            .slice(0, 10)
                                            .map((soldier, index) => (
                                                <tr
                                                    key={soldier.id}
                                                    className="border-b border-gray-800"
                                                >
                                                    <td className="py-2 text-sm text-white minecraft-font">
                                                        {index + 1}
                                                    </td>
                                                    <td className="py-2 text-sm text-white minecraft-font">
                                                        {soldier.name}
                                                    </td>
                                                    <td className="py-2 text-sm text-white minecraft-font text-right">
                                                        {soldier.votes}
                                                    </td>
                                                    {activeTab === 'completed' && (
                                                        <td className="py-2 text-sm text-red-500 minecraft-font text-right">
                                                            {soldier.burned > 0
                                                                ? `🔥 ${soldier.burned}`
                                                                : '-'}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-700">
                                <Link
                                    href="/"
                                    className="text-center block text-gray-400 hover:text-gray-300 minecraft-btn"
                                >
                                    ← BACK TO HOME
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
                    font-family: 'Minecraft', monospace !important;
                    letter-spacing: 1px;
                    cursor: pointer;
                    text-align: center;
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

                .minecraft-btn-blue {
                    display: inline-block;
                    padding: 6px 12px;
                    font-size: 12px;
                    font-weight: bold;
                    text-transform: uppercase;
                    background-color: #3b82f6;
                    border: 3px solid #333;
                    color: white;
                    box-shadow: 3px 3px 0px #222;
                    position: relative;
                    transition: all 0.1s;
                    font-family: 'Minecraft', monospace !important;
                    letter-spacing: 1px;
                    cursor: pointer;
                }

                .minecraft-btn-blue:hover {
                    background-color: #60a5fa;
                    transform: translateY(-2px);
                }

                .minecraft-btn-blue:active {
                    background-color: #2563eb;
                    transform: translateY(2px);
                    box-shadow: 1px 1px 0px #222;
                }

                .minecraft-btn-red {
                    display: inline-block;
                    padding: 12px 24px;
                    font-size: 18px;
                    font-weight: bold;
                    text-transform: uppercase;
                    background-color: #ef4444;
                    border: 3px solid #333;
                    color: white;
                    box-shadow: 3px 3px 0px #222;
                    position: relative;
                    transition: all 0.1s;
                    font-family: 'Minecraft', monospace !important;
                    letter-spacing: 1px;
                    cursor: pointer;
                }

                .minecraft-btn-red:hover {
                    background-color: #dc2626;
                    transform: translateY(-2px);
                }

                .minecraft-btn-red:active {
                    background-color: #b91c1c;
                    transform: translateY(2px);
                    box-shadow: 1px 1px 0px #222;
                }

                .minecraft-btn-sm {
                    display: inline-block;
                    padding: 4px 8px;
                    font-size: 10px;
                    font-weight: bold;
                    text-transform: uppercase;
                    background-color: #f59e0b;
                    border: 2px solid #333;
                    color: white;
                    box-shadow: 2px 2px 0px #222;
                    position: relative;
                    transition: all 0.1s;
                    font-family: 'Minecraft', monospace;
                    letter-spacing: 1px;
                    cursor: pointer;
                }

                .minecraft-btn-sm:hover {
                    background-color: #f97316;
                    transform: translateY(-1px);
                }

                .minecraft-btn-sm:active {
                    background-color: #d97706;
                    transform: translateY(1px);
                    box-shadow: 1px 1px 0px #222;
                }

                .pixelated {
                    image-rendering: pixelated;
                }

                .battle-effect {
                    width: 40px;
                    height: 40px;
                    background-color: rgba(255, 0, 0, 0.3);
                    border-radius: 50%;
                    box-shadow: 0 0 20px 10px rgba(255, 0, 0, 0.2);
                    animation: battle-pulse 1.5s infinite alternate;
                }

                .battle-link {
                    position: relative;
                    display: inline-block;
                    transition: all 0.2s;
                    font-family: 'Minecraft', monospace !important;
                    font-weight: bold;
                    letter-spacing: 1px;
                }

                .battle-link:hover {
                    text-shadow: 0 0 5px rgba(255, 200, 0, 0.5);
                    transform: translateX(2px);
                }

                .battle-link:active {
                    transform: translateX(0px);
                }

                @keyframes battle-pulse {
                    0% {
                        opacity: 0.5;
                        transform: scale(0.9);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1.2);
                    }
                }

                .vote-animation {
                    top: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    animation: vote-pulse 2s ease-out forwards;
                    font-weight: bold;
                    text-shadow: 0 0 4px rgba(255, 255, 0, 0.8);
                    font-size: 16px;
                    color: #ffd700;
                }

                @keyframes vote-pulse {
                    0% {
                        opacity: 0;
                        transform: translateX(-50%) scale(0.8);
                    }
                    20% {
                        opacity: 1;
                        transform: translateX(-50%) scale(1.2);
                    }
                    80% {
                        opacity: 0.8;
                        transform: translateX(-50%) translateY(-25px) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-40px) scale(0.8);
                    }
                }

                .burn-animation {
                    position: absolute;
                    top: -15px;
                    left: 100%;
                    font-size: 18px;
                    animation: burn-flicker 2s ease-out infinite;
                }

                .burn-animation-large {
                    position: absolute;
                    top: -10px;
                    left: 105%;
                    font-size: 24px;
                    animation: burn-flicker-large 3s ease-out infinite;
                    z-index: 10;
                }

                @keyframes burn-flicker {
                    0% {
                        opacity: 0.5;
                        transform: scale(0.8) rotate(-5deg);
                        text-shadow: 0 0 5px #ff3700;
                    }
                    25% {
                        opacity: 1;
                        transform: scale(1.2) rotate(5deg);
                        text-shadow:
                            0 0 10px #ff5e00,
                            0 0 20px #ff8c00;
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1) rotate(-3deg);
                        text-shadow: 0 0 15px #ff5e00;
                    }
                    75% {
                        opacity: 1;
                        transform: scale(1.1) rotate(3deg);
                        text-shadow:
                            0 0 10px #ff3700,
                            0 0 15px #ff5e00;
                    }
                    100% {
                        opacity: 0.7;
                        transform: scale(0.9) rotate(-5deg);
                        text-shadow: 0 0 5px #ff3700;
                    }
                }

                @keyframes burn-flicker-large {
                    0% {
                        opacity: 0.7;
                        transform: scale(1) rotate(-3deg);
                        text-shadow:
                            0 0 10px #ff3700,
                            0 0 15px #ff5e00;
                    }
                    25% {
                        opacity: 1;
                        transform: scale(1.5) rotate(5deg);
                        text-shadow:
                            0 0 15px #ff5e00,
                            0 0 30px #ff8c00;
                    }
                    50% {
                        opacity: 0.9;
                        transform: scale(1.2) rotate(-5deg);
                        text-shadow: 0 0 20px #ff5e00;
                    }
                    75% {
                        opacity: 1;
                        transform: scale(1.4) rotate(3deg);
                        text-shadow:
                            0 0 15px #ff3700,
                            0 0 25px #ff5e00;
                    }
                    100% {
                        opacity: 0.8;
                        transform: scale(1.1) rotate(-3deg);
                        text-shadow: 0 0 10px #ff3700;
                    }
                }
            `}</style>
        </div>
    );
}
