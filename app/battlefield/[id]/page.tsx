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
                burned: 0,
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
                burned: 0,
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
    const [fighter1HP, setFighter1HP] = useState(100);
    const [fighter2HP, setFighter2HP] = useState(100);
    const [currentRound, setCurrentRound] = useState(0);
    const [battleEnded, setBattleEnded] = useState(false);
    const [fighter1Burned, setFighter1Burned] = useState(0);
    const [fighter2Burned, setFighter2Burned] = useState(0);
    const [showBurnEffect, setShowBurnEffect] = useState(false);

    useEffect(() => {
        if (!isConnected) {
            router.push('/');
            return;
        }

        // 獲取戰鬥數據
        const battleData = MOCK_BATTLES.find((b) => b.id === parseInt(params.id));
        if (battleData) {
            setBattle(battleData);
            // 初始化HP
            setFighter1HP(battleData.participants[0].hp);
            setFighter2HP(battleData.participants[1].hp);
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

    // 執行單回合攻擊
    const executeAttackRound = (round: number) => {
        const baseDelay = 1000; // 固定每回合基礎延遲為1秒，不再累加

        // 跳躍階段
        setTimeout(() => {
            setBattlePhase('jump');
            setFighter1Style({
                transform: 'translateY(-50px) rotate(-5deg)',
                transition: 'all 0.4s ease-out',
            });
            setFighter2Style({
                transform: 'translateY(-50px) scaleX(-1) rotate(5deg)',
                transition: 'all 0.4s ease-out',
            });
        }, baseDelay);

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
        }, baseDelay + 600);

        // 碰撞效果和傷害計算
        setTimeout(() => {
            setBattlePhase('hit');
            setShowHitEffect(true);
            setHitPosition({ x: 0, y: -40 });

            // 隨機傷害計算 (隨回合數增加而增加，但不讓雙方同時歸零)
            const baseDamage = 15 + round * 5; // 基礎傷害隨回合增加
            const variance = 10 + round * 2; // 傷害浮動範圍也隨回合增加

            let damage1 = Math.floor(Math.random() * variance) + baseDamage;
            let damage2 = Math.floor(Math.random() * variance) + baseDamage;

            // 確保最後一擊不會導致雙方同時歸零
            setFighter1HP((prev) => {
                const newHP1 = Math.max(0, prev - damage2);

                // 如果兩邊都會歸零，確保至少一方有1點血
                setFighter2HP((prev2) => {
                    const newHP2 = Math.max(0, prev2 - damage1);

                    if (newHP1 === 0 && newHP2 === 0) {
                        // 隨機選擇一方保留1點HP
                        if (Math.random() > 0.5) {
                            return 1; // fighter2保留1點HP
                        } else {
                            setTimeout(() => setFighter1HP(1), 0); // fighter1保留1點HP
                            return 0;
                        }
                    }

                    return newHP2;
                });

                return newHP1;
            });

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
        }, baseDelay + 900);

        // 回合結束，檢查HP
        setTimeout(() => {
            // 使用回調函數形式獲取最新的HP值進行判斷
            setFighter1HP((currentHP1) => {
                setFighter2HP((currentHP2) => {
                    if (currentHP1 <= 0 || currentHP2 <= 0) {
                        // 至少一方HP歸零，結束戰鬥
                        setTimeout(() => finishBattle(), 0);
                    } else if (round < 5) {
                        // 還有回合，繼續下一回合
                        setCurrentRound(round + 1);
                        setTimeout(() => executeAttackRound(round + 1), 500);
                    } else {
                        // 達到最大回合數，結束戰鬥
                        setTimeout(() => finishBattle(), 0);
                    }
                    return currentHP2;
                });
                return currentHP1;
            });
        }, baseDelay + 1800);
    };

    // 結束戰鬥
    const finishBattle = () => {
        setBattlePhase('finish');
        setBattleEnded(true);

        // 重置位置
        setFighter1Style({
            transform: 'translateX(0) translateY(0)',
            transition: 'all 0.5s ease-out',
        });
        setFighter2Style({
            transform: 'translateX(0) translateY(0) scaleX(-1)',
            transition: 'all 0.5s ease-out',
        });

        // 決定勝利者 - 使用函數形式獲取最新狀態
        setFighter1HP((hp1) => {
            setFighter2HP((hp2) => {
                let battleWinner;

                if (hp1 <= 0 && hp2 <= 0) {
                    // 這種情況不應該發生，因為我們已經在傷害計算時處理了
                    battleWinner = Math.random() > 0.5 ? 0 : 1;
                } else if (hp1 <= 0) {
                    battleWinner = 1;
                } else if (hp2 <= 0) {
                    battleWinner = 0;
                } else {
                    // 如果雙方都還有HP，選擇HP較高的一方
                    battleWinner = hp1 > hp2 ? 0 : 1;
                }

                setWinner(battleWinner);

                // 計算燃燒值 - 勝方燃燒值較少，輸方較多
                const winnerBurn = Math.floor(Math.random() * 11) + 5; // 勝方燃燒值5-15
                const loserBurnMultiplier = 1.5 + Math.random(); // 1.5-2.5倍
                const loserBurn = Math.floor(winnerBurn * loserBurnMultiplier); // 輸方燃燒值是勝方的1.5-2.5倍

                if (battleWinner === 0) {
                    setFighter1Burned(winnerBurn);
                    setFighter2Burned(loserBurn);
                } else {
                    setFighter1Burned(loserBurn);
                    setFighter2Burned(winnerBurn);
                }

                // 顯示燃燒效果
                setTimeout(() => {
                    setShowBurnEffect(true);
                    setTimeout(() => setShowBurnEffect(false), 3000);
                }, 1000);

                // 勝利者動畫
                if (battleWinner === 0) {
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

                return hp2;
            });
            return hp1;
        });
    };

    // 增強戰鬥動畫
    const startBattle = () => {
        setBattleStarted(true);
        setBattlePhase('ready');
        setCurrentRound(1);

        // 開始第一回合攻擊
        executeAttackRound(1);
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
                    <div className="text-center mb-8">
                        {battleStarted && !battleEnded && (
                            <div className="text-xl text-white minecraft-font mt-2">
                                ROUND {currentRound}
                            </div>
                        )}
                    </div>

                    {/* 戰鬥者狀態欄 */}
                    <div className="flex justify-between mb-8">
                        {/* 左側戰鬥者 */}
                        <div className="w-64 pixel-border bg-black/80 p-2">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white minecraft-font">
                                    {battle.participants[0].name}
                                </span>
                                <span
                                    className={`minecraft-font ${fighter1HP <= 30 ? 'text-red-500' : 'text-yellow-300'}`}
                                >
                                    HP: {fighter1HP}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 h-3 pixel-border">
                                <div
                                    className={`h-full transition-all duration-300 ${fighter1HP <= 30 ? 'bg-red-500' : 'bg-green-500'}`}
                                    style={{ width: `${fighter1HP}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* 右側戰鬥者 */}
                        <div className="w-64 pixel-border bg-black/80 p-2">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white minecraft-font">
                                    {battle.participants[1].name}
                                </span>
                                <span
                                    className={`minecraft-font ${fighter2HP <= 30 ? 'text-red-500' : 'text-yellow-300'}`}
                                >
                                    HP: {fighter2HP}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 h-3 pixel-border">
                                <div
                                    className={`h-full transition-all duration-300 ${fighter2HP <= 30 ? 'bg-red-500' : 'bg-green-500'}`}
                                    style={{ width: `${fighter2HP}%` }}
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
                            {battleStarted && fighter1HP <= 0 && (
                                <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
                                    <span className="text-red-500 minecraft-font text-xl">
                                        K.O.
                                    </span>
                                </div>
                            )}
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
                                <div className="text-center">
                                    <div className="text-4xl text-yellow-300 minecraft-font font-bold battle-pulse mb-4">
                                        {battle.participants[winner].name} WINS!
                                    </div>

                                    {/* 燃燒值顯示 */}
                                    {(fighter1Burned > 0 || fighter2Burned > 0) && (
                                        <div className="mt-8 bg-black/80 p-4 pixel-border">
                                            <div className="text-xl text-red-500 minecraft-font mb-3 flex items-center justify-center">
                                                <span className="mx-1">🔥</span>
                                                BURN RESULT
                                                <span className="mx-1">🔥</span>
                                            </div>

                                            <div className="flex justify-between mb-3">
                                                <div className="text-center relative">
                                                    <span className="block text-red-500 minecraft-font text-xl font-bold">
                                                        🔥 {fighter1Burned}
                                                        {showBurnEffect && (
                                                            <>
                                                                <span className="burn-effect absolute -top-6 left-full">
                                                                    🔥
                                                                </span>
                                                                <span
                                                                    className="burn-effect absolute -top-6 left-1/4"
                                                                    style={{
                                                                        animationDelay: '0.3s',
                                                                    }}
                                                                >
                                                                    🔥
                                                                </span>
                                                                <span
                                                                    className="burn-effect absolute -top-8 left-1/2"
                                                                    style={{
                                                                        animationDelay: '0.6s',
                                                                        fontSize: '20px',
                                                                    }}
                                                                >
                                                                    🔥
                                                                </span>
                                                            </>
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-red-400 minecraft-font">
                                                        {battle.participants[0].name}
                                                    </span>
                                                    <span className="text-xs text-red-300 minecraft-font block mt-1">
                                                        {winner === 0 ? 'WINNER' : 'LOSER'}
                                                    </span>
                                                </div>

                                                <div className="text-center relative">
                                                    <span className="block text-red-500 minecraft-font text-xl font-bold">
                                                        🔥 {fighter2Burned}
                                                        {showBurnEffect && (
                                                            <>
                                                                <span className="burn-effect absolute -top-6 left-full">
                                                                    🔥
                                                                </span>
                                                                <span
                                                                    className="burn-effect absolute -top-6 left-1/4"
                                                                    style={{
                                                                        animationDelay: '0.2s',
                                                                    }}
                                                                >
                                                                    🔥
                                                                </span>
                                                                <span
                                                                    className="burn-effect absolute -top-8 left-1/2"
                                                                    style={{
                                                                        animationDelay: '0.5s',
                                                                        fontSize: '20px',
                                                                    }}
                                                                >
                                                                    🔥
                                                                </span>
                                                            </>
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-red-400 minecraft-font">
                                                        {battle.participants[1].name}
                                                    </span>
                                                    <span className="text-xs text-red-300 minecraft-font block mt-1">
                                                        {winner === 1 ? 'WINNER' : 'LOSER'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="relative h-4 bg-gray-800 border-2 border-gray-600 mt-1">
                                                <div
                                                    className="absolute h-full bg-red-600"
                                                    style={{
                                                        width: `${(fighter1Burned / (fighter1Burned + fighter2Burned)) * 100}%`,
                                                    }}
                                                ></div>
                                                <div
                                                    className="absolute h-full bg-red-900 right-0"
                                                    style={{
                                                        width: `${(fighter2Burned / (fighter1Burned + fighter2Burned)) * 100}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
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
                            {battleStarted && fighter2HP <= 0 && (
                                <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
                                    <span className="text-red-500 minecraft-font text-xl">
                                        K.O.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .pixel-border {
                    border: 4px solid #555;
                    box-shadow: inset 0 0 0 4px #333;
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

                .burn-effect {
                    font-size: 24px;
                    animation: burn-anim 2s ease-out infinite;
                }

                @keyframes burn-anim {
                    0% {
                        opacity: 0.7;
                        transform: translate(0, 0) scale(1) rotate(-5deg);
                        text-shadow: 0 0 10px #ff3700;
                    }
                    25% {
                        opacity: 1;
                        transform: translate(5px, -10px) scale(1.5) rotate(5deg);
                        text-shadow:
                            0 0 15px #ff5e00,
                            0 0 30px #ff8c00;
                    }
                    50% {
                        opacity: 0.9;
                        transform: translate(10px, -20px) scale(1.2) rotate(-5deg);
                        text-shadow: 0 0 20px #ff5e00;
                    }
                    75% {
                        opacity: 0.8;
                        transform: translate(15px, -30px) scale(1.4) rotate(3deg);
                        text-shadow:
                            0 0 15px #ff3700,
                            0 0 25px #ff5e00;
                    }
                    100% {
                        opacity: 0;
                        transform: translate(20px, -40px) scale(1.1) rotate(-3deg);
                        text-shadow: 0 0 10px #ff3700;
                    }
                }
            `}</style>
        </div>
    );
}
