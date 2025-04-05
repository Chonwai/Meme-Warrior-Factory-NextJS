'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useWallet } from '@/lib/wallet-context';

// 背景圖片列表
const BATTLEFIELD_BACKGROUNDS = [
    '/images/battlefield/battlefield_bg01.png',
    '/images/battlefield/battlefield_bg02.png',
];

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
                hp: 100,
                power: 85,
                defense: 70,
            },
            {
                id: 102,
                name: 'FROG GENERAL',
                prompt: 'A frog wearing military uniform with a commander stick',
                votes: 143,
                image: '/images/dispatcher.png',
                hp: 100,
                power: 75,
                defense: 80,
            },
        ],
        startTime: '2023-04-05T12:00:00Z',
        endTime: '2023-04-05T18:00:00Z',
        background: BATTLEFIELD_BACKGROUNDS[0],
    },
    // ... 其他戰鬥數據
];

export default function BattlePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { isConnected } = useWallet();
    const [battle, setBattle] = useState<any>(null);
    const [background] = useState(
        () => BATTLEFIELD_BACKGROUNDS[Math.floor(Math.random() * BATTLEFIELD_BACKGROUNDS.length)]
    );
    const [showIntro, setShowIntro] = useState(true);
    const [battleStarted, setBattleStarted] = useState(false);
    const [winner, setWinner] = useState<number | null>(null);
    const [fighter1Pos, setFighter1Pos] = useState({ x: -100, opacity: 0 });
    const [fighter2Pos, setFighter2Pos] = useState({ x: 100, opacity: 0 });
    const [battlePhase, setBattlePhase] = useState<'ready' | 'jump' | 'attack' | 'hit' | 'finish'>(
        'ready'
    );
    const [fighter1Style, setFighter1Style] = useState({});
    const [fighter2Style, setFighter2Style] = useState({});
    const [showHitEffect, setShowHitEffect] = useState(false);
    const [hitPosition, setHitPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!isConnected) {
            router.push('/');
            return;
        }

        // 獲取戰鬥數據
        const battleData = MOCK_BATTLES.find((b) => b.id === parseInt(params.id));
        if (battleData) {
            setBattle(battleData);
        }

        // 開場動畫
        if (showIntro) {
            setTimeout(() => {
                setFighter1Pos({ x: 0, opacity: 1 });
                setFighter2Pos({ x: 0, opacity: 1 });
            }, 1000);

            setTimeout(() => {
                setShowIntro(false);
            }, 3000);
        }
    }, [isConnected, params.id, router, showIntro]);

    // 增強戰鬥動畫
    const startBattle = () => {
        setBattleStarted(true);
        setBattlePhase('ready');

        // 預備姿勢
        setTimeout(() => {
            // 跳躍階段
            setBattlePhase('jump');
            setFighter1Style({
                transform: 'translateY(-50px) rotate(-5deg)',
                transition: 'all 0.4s ease-out',
            });
            setFighter2Style({
                transform: 'translateY(-50px) scaleX(-1) rotate(5deg)',
                transition: 'all 0.4s ease-out',
            });
        }, 500);

        // 攻擊階段
        setTimeout(() => {
            setBattlePhase('attack');
            setFighter1Style({
                transform: 'translateX(80px) translateY(-20px) rotate(-10deg) scale(1.1)',
                transition: 'all 0.3s ease-in-out',
            });
            setFighter2Style({
                transform:
                    'translateX(-80px) translateY(-20px) scaleX(-1) rotate(10deg) scale(1.1)',
                transition: 'all 0.3s ease-in-out',
            });
        }, 1200);

        // 碰撞效果
        setTimeout(() => {
            setBattlePhase('hit');
            setShowHitEffect(true);
            setHitPosition({ x: 0, y: -40 });

            // 衝擊波動畫
            setTimeout(() => setShowHitEffect(false), 400);

            // 角色後退
            setFighter1Style({
                transform: 'translateX(-30px) translateY(0) rotate(5deg)',
                transition: 'all 0.2s ease-in',
            });
            setFighter2Style({
                transform: 'translateX(30px) translateY(0) scaleX(-1) rotate(-5deg)',
                transition: 'all 0.2s ease-in',
            });
        }, 1500);

        // 第二次攻擊
        setTimeout(() => {
            setBattlePhase('attack');
            setFighter1Style({
                transform: 'translateX(100px) translateY(-10px) rotate(-15deg) scale(1.15)',
                transition: 'all 0.25s ease-in-out',
            });
            setFighter2Style({
                transform:
                    'translateX(-100px) translateY(-10px) scaleX(-1) rotate(15deg) scale(1.15)',
                transition: 'all 0.25s ease-in-out',
            });
        }, 2200);

        // 第二次碰撞
        setTimeout(() => {
            setBattlePhase('hit');
            setShowHitEffect(true);
            setHitPosition({ x: 0, y: -30 });

            // 衝擊波動畫
            setTimeout(() => setShowHitEffect(false), 400);

            // 角色大幅後退
            setFighter1Style({
                transform: 'translateX(-50px) translateY(10px) rotate(10deg)',
                transition: 'all 0.3s ease-in',
            });
            setFighter2Style({
                transform: 'translateX(50px) translateY(10px) scaleX(-1) rotate(-10deg)',
                transition: 'all 0.3s ease-in',
            });
        }, 2500);

        // 結束階段
        setTimeout(() => {
            setBattlePhase('finish');
            // 重置位置
            setFighter1Style({
                transform: 'translateX(0) translateY(0)',
                transition: 'all 0.5s ease-out',
            });
            setFighter2Style({
                transform: 'translateX(0) translateY(0) scaleX(-1)',
                transition: 'all 0.5s ease-out',
            });

            // 隨機選擇勝利者
            const randomWinner = Math.random() > 0.5 ? 0 : 1;
            setWinner(randomWinner);

            // 勝利者動畫
            if (randomWinner === 0) {
                setFighter1Style({
                    transform: 'translateY(-20px) scale(1.1)',
                    transition: 'all 0.3s ease-in-out',
                    filter: 'brightness(1.3)',
                });
                setFighter2Style({
                    transform: 'translateY(20px) scaleX(-1) rotate(20deg)',
                    transition: 'all 0.3s ease-in-out',
                    filter: 'brightness(0.7)',
                });
            } else {
                setFighter1Style({
                    transform: 'translateY(20px) rotate(-20deg)',
                    transition: 'all 0.3s ease-in-out',
                    filter: 'brightness(0.7)',
                });
                setFighter2Style({
                    transform: 'translateY(-20px) scaleX(-1) scale(1.1)',
                    transition: 'all 0.3s ease-in-out',
                    filter: 'brightness(1.3)',
                });
            }
        }, 4000);
    };

    if (!battle) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <p className="minecraft-font text-xl text-gray-300">Loading battle...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 relative overflow-hidden">
            {/* 背景圖片 */}
            <div className="absolute inset-0">
                <Image
                    src={background}
                    alt="Battlefield"
                    fill
                    className="object-cover pixelated"
                    priority
                />
            </div>

            {/* 頂部資訊欄 */}
            <div className="relative z-10 p-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center">
                        <Link href="/battlefield" className="minecraft-btn">
                            BACK
                        </Link>
                        <h1 className="text-2xl font-bold text-yellow-300 minecraft-font">
                            {battle.name}
                        </h1>
                        <div className="w-24"></div> {/* 為了保持標題居中 */}
                    </div>
                </div>
            </div>

            {/* 戰鬥區域 */}
            <div
                className="relative z-10 flex justify-center items-center"
                style={{ height: 'calc(100vh - 100px)' }}
            >
                <div className="w-full max-w-6xl mx-auto px-4">
                    {/* 戰鬥者狀態欄 */}
                    <div className="flex justify-between mb-8">
                        {/* 左側戰鬥者 */}
                        <div className="w-64 pixel-border bg-black/80 p-2">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white minecraft-font">
                                    {battle.participants[0].name}
                                </span>
                                <span className="text-yellow-300 minecraft-font">
                                    HP: {battle.participants[0].hp}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 h-3 pixel-border">
                                <div
                                    className="bg-green-500 h-full"
                                    style={{ width: `${battle.participants[0].hp}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* 右側戰鬥者 */}
                        <div className="w-64 pixel-border bg-black/80 p-2">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white minecraft-font">
                                    {battle.participants[1].name}
                                </span>
                                <span className="text-yellow-300 minecraft-font">
                                    HP: {battle.participants[1].hp}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 h-3 pixel-border">
                                <div
                                    className="bg-green-500 h-full"
                                    style={{ width: `${battle.participants[1].hp}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* 戰鬥者 */}
                    <div className="flex justify-between items-center relative h-96">
                        {/* 左側戰鬥者 */}
                        <div
                            className="w-48 h-48 transition-all duration-1000 transform"
                            style={{
                                transform: `translateX(${fighter1Pos.x}px)`,
                                opacity: fighter1Pos.opacity,
                                ...fighter1Style,
                            }}
                        >
                            <div className="pixel-border overflow-hidden w-full h-full">
                                <Image
                                    src={battle.participants[0].image}
                                    alt={battle.participants[0].name}
                                    width={192}
                                    height={192}
                                    className={`pixelated ${battleStarted && battlePhase !== 'finish' ? 'battle-shake' : ''}`}
                                />
                            </div>
                        </div>

                        {/* VS或勝利提示 */}
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            {showIntro ? (
                                <div className="text-6xl text-red-500 minecraft-font font-bold battle-pulse">
                                    VS
                                </div>
                            ) : !battleStarted ? (
                                <button
                                    onClick={startBattle}
                                    className="minecraft-btn-red text-xl minecraft-font"
                                >
                                    START BATTLE!
                                </button>
                            ) : winner !== null ? (
                                <div className="text-4xl text-yellow-300 minecraft-font font-bold battle-pulse">
                                    {battle.participants[winner].name} WINS!
                                </div>
                            ) : (
                                <div className="text-4xl text-red-500 minecraft-font font-bold battle-pulse">
                                    FIGHT!
                                </div>
                            )}
                        </div>

                        {/* 碰撞特效 */}
                        {showHitEffect && (
                            <div
                                className="absolute hit-effect"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    transform: `translate(-50%, -50%) translate(${hitPosition.x}px, ${hitPosition.y}px)`,
                                }}
                            ></div>
                        )}

                        {/* 右側戰鬥者 */}
                        <div
                            className="w-48 h-48 transition-all duration-1000 transform"
                            style={{
                                transform: `translateX(${fighter2Pos.x}px) scaleX(-1)`,
                                opacity: fighter2Pos.opacity,
                                ...fighter2Style,
                            }}
                        >
                            <div className="pixel-border overflow-hidden w-full h-full">
                                <Image
                                    src={battle.participants[1].image}
                                    alt={battle.participants[1].name}
                                    width={192}
                                    height={192}
                                    className={`pixelated ${battleStarted && battlePhase !== 'finish' ? 'battle-shake' : ''}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .pixel-border {
                    border: 4px solid #555;
                    box-shadow: inset 0 0 0 4px #333;
                }

                .minecraft-font {
                    font-family: 'Minecraft', monospace !important;
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

                .hit-effect {
                    width: 100px;
                    height: 100px;
                    background: radial-gradient(
                        circle,
                        rgba(255, 255, 255, 0.9) 0%,
                        rgba(255, 200, 0, 0.6) 40%,
                        rgba(255, 0, 0, 0) 70%
                    );
                    border-radius: 50%;
                    animation: hit-animation 0.4s ease-out forwards;
                    mix-blend-mode: screen;
                }

                @keyframes hit-animation {
                    0% {
                        transform: translate(-50%, -50%) scale(0.2);
                        opacity: 0.8;
                    }
                    60% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1.5);
                        opacity: 0;
                    }
                }

                @keyframes battle-pulse {
                    0% {
                        transform: scale(1);
                        text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
                    }
                    50% {
                        transform: scale(1.1);
                        text-shadow: 0 0 20px rgba(255, 0, 0, 0.7);
                    }
                    100% {
                        transform: scale(1);
                        text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
                    }
                }

                .battle-pulse {
                    animation: battle-pulse 1.5s infinite;
                }

                @keyframes battle-shake {
                    0%,
                    100% {
                        transform: translateX(0);
                    }
                    25% {
                        transform: translateX(-5px);
                    }
                    75% {
                        transform: translateX(5px);
                    }
                }

                .battle-shake {
                    animation: battle-shake 0.5s infinite;
                }
            `}</style>
        </div>
    );
}
