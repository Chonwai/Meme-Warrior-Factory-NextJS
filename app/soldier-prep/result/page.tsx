'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// 角色狀態類型
type CharacterState = 'idle' | 'active' | 'excited';

// Simulated soldier attributes
const SOLDIER_ATTRIBUTES = {
    humor: 0,
    virality: 0,
    originality: 0,
    strength: 0,
};

// 客戶端組件 - 使用 searchParams
function ResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [attributes, setAttributes] = useState(SOLDIER_ATTRIBUTES);
    const [tokenAmount, setTokenAmount] = useState(0);
    const [soldierImage, setSoldierImage] = useState('/images/soldier-placeholder.png');
    const [soldiersData, setSoldiersData] = useState<any[]>([]);
    const [selectedSoldierIndex, setSelectedSoldierIndex] = useState(0);
    const [characterStates, setCharacterStates] = useState({
        memeSoldier: 'excited' as CharacterState,
        dispatcher: 'active' as CharacterState,
    });

    // 處理搜索參數，只在 searchParams 變化時執行
    useEffect(() => {
        if (!searchParams) return;

        const promptParam = searchParams.get('prompt');
        const soldiersParam = searchParams.get('soldiers');

        if (promptParam) {
            setPrompt(decodeURIComponent(promptParam));

            // 設置默認令牌數量
            setTokenAmount(Math.floor(Math.random() * 1000) + 100);

            // 解析soldiers參數
            if (soldiersParam) {
                try {
                    const soldiers = JSON.parse(decodeURIComponent(soldiersParam));

                    if (Array.isArray(soldiers) && soldiers.length > 0) {
                        console.log('收到的戰士數據:', soldiers);
                        setSoldiersData(soldiers);

                        // 設置第一個戰士為默認選中
                        setSelectedSoldierIndex(0);

                        // 設置第一個戰士的圖像，並確保圖像URL可用
                        if (soldiers[0].image_url) {
                            // 預加載圖像以檢查URL是否有效
                            const preloadImage = new (window as any).Image();
                            preloadImage.src = soldiers[0].image_url;
                            preloadImage.onload = () => {
                                setSoldierImage(soldiers[0].image_url);
                            };
                            preloadImage.onerror = () => {
                                console.error('圖像URL無效，使用默認圖像');
                                setSoldierImage('/images/meme-soldier.png');
                            };
                        } else {
                            setSoldierImage('/images/meme-soldier.png');
                        }

                        // 基於戰士名稱生成隨機屬性
                        // 在實際項目中，這些屬性應該來自API
                        setAttributes({
                            humor: Math.floor(Math.random() * 70) + 30,
                            virality: Math.floor(Math.random() * 70) + 30,
                            originality: Math.floor(Math.random() * 70) + 30,
                            strength: Math.floor(Math.random() * 70) + 30,
                        });
                    }
                } catch (error) {
                    console.error('解析戰士數據時出錯:', error);
                }
            }
        } else {
            // If no prompt parameter, return to input page
            router.push('/soldier-prep');
        }
    }, [searchParams, router]);

    // 角色動畫效果
    useEffect(() => {
        // Occasionally change character states to create more dynamic animations
        const animationInterval = setInterval(() => {
            setCharacterStates((prev) => {
                const memeSoldierState = Math.random() > 0.7 ? 'excited' : 'active';
                const dispatcherState = Math.random() > 0.7 ? 'active' : 'idle';

                return {
                    memeSoldier: memeSoldierState as CharacterState,
                    dispatcher: dispatcherState as CharacterState,
                };
            });
        }, 3000);

        // Clear animations on component unmount
        return () => {
            clearInterval(animationInterval);
        };
    }, []);

    // 選擇不同的戰士
    const selectSoldier = (index: number) => {
        if (index >= 0 && index < soldiersData.length) {
            setSelectedSoldierIndex(index);

            // 更新選中戰士的圖像，並確保圖像URL可用
            if (soldiersData[index].image_url) {
                // 預加載圖像以檢查URL是否有效
                const preloadImage = new (window as any).Image();
                preloadImage.src = soldiersData[index].image_url;
                preloadImage.onload = () => {
                    setSoldierImage(soldiersData[index].image_url);
                };
                preloadImage.onerror = () => {
                    console.error('圖像URL無效，使用默認圖像');
                    setSoldierImage('/images/meme-soldier.png');
                };
            } else {
                setSoldierImage('/images/meme-soldier.png');
            }

            // 更新選中戰士的屬性
            // 在實際項目中，這些屬性應該來自API
            setAttributes({
                humor: Math.floor(Math.random() * 70) + 30,
                virality: Math.floor(Math.random() * 70) + 30,
                originality: Math.floor(Math.random() * 70) + 30,
                strength: Math.floor(Math.random() * 70) + 30,
            });
        }
    };

    const handleDeploy = () => {
        // 保存選中的戰士到localStorage
        const selectedSoldier = getCurrentSoldier();
        if (selectedSoldier) {
            try {
                // 確保在瀏覽器環境中執行
                if (typeof window !== 'undefined') {
                    // 保存選中的戰士數據
                    const warriorToSave = {
                        id: selectedSoldier.id || Math.floor(Math.random() * 10000),
                        name: selectedSoldier.name || 'Unnamed Warrior',
                        prompt: selectedSoldier.prompt || prompt,
                        image_url: soldierImage, // 使用當前顯示的圖像URL (可能是本地備用圖像)
                        attributes: attributes,
                    };

                    localStorage.setItem('selectedMemeWarrior', JSON.stringify(warriorToSave));
                    console.log('保存戰士數據成功', warriorToSave);
                }
            } catch (err) {
                console.error('保存戰士數據失敗', err);
                // 硬編碼備用方案 - 如果localStorage失敗，使用全局變量
                if (typeof window !== 'undefined') {
                    (window as any).__selectedMemeWarrior = {
                        id: selectedSoldier.id || 999,
                        name: selectedSoldier.name || 'Backup Warrior',
                        prompt: selectedSoldier.prompt || prompt,
                        image_url: '/images/meme-soldier.png',
                        attributes: attributes,
                    };
                }
            }
        }

        // Deploy to battlefield (should call smart contract in actual project)
        router.push('/battlefield');
    };

    const handleKeep = () => {
        // 保存選中的戰士到localStorage
        const selectedSoldier = getCurrentSoldier();
        if (selectedSoldier) {
            try {
                // 確保在瀏覽器環境中執行
                if (typeof window !== 'undefined') {
                    // 獲取現有的戰士列表
                    let currentWarriors = [];
                    try {
                        const savedWarriors = localStorage.getItem('walletMemeWarriors');
                        if (savedWarriors) {
                            currentWarriors = JSON.parse(savedWarriors);
                            if (!Array.isArray(currentWarriors)) {
                                currentWarriors = []; // 重置為空數組，如果解析結果不是數組
                            }
                        }
                    } catch (e) {
                        console.error('獲取現有戰士列表失敗', e);
                    }

                    // 添加新戰士
                    const newWarrior = {
                        id: selectedSoldier.id || Math.floor(Math.random() * 10000),
                        name: selectedSoldier.name || 'Unnamed Warrior',
                        prompt: selectedSoldier.prompt || prompt,
                        image_url: soldierImage, // 使用當前顯示的圖像URL
                        attributes: attributes,
                    };

                    currentWarriors.push(newWarrior);

                    // 保存更新後的列表
                    localStorage.setItem('walletMemeWarriors', JSON.stringify(currentWarriors));
                    console.log('保存戰士數據到錢包成功', newWarrior);
                }
            } catch (err) {
                console.error('保存戰士數據失敗', err);
                // 硬編碼備用方案
                if (typeof window !== 'undefined') {
                    (window as any).__walletMemeWarriors = [
                        {
                            id: selectedSoldier.id || 999,
                            name: selectedSoldier.name || 'Backup Warrior',
                            prompt: selectedSoldier.prompt || prompt,
                            image_url: '/images/meme-soldier.png',
                            attributes: attributes,
                        },
                    ];
                }
            }
        }

        // Save to wallet (should call smart contract in actual project)
        router.push('/wallet');
    };

    // Helper functions to get animation classes
    const getMemeSoldierClass = () => {
        switch (characterStates.memeSoldier) {
            case 'excited':
                return 'sprite-excited';
            case 'active':
                return 'sprite-active';
            default:
                return 'sprite-idle';
        }
    };

    const getDispatcherClass = () => {
        switch (characterStates.dispatcher) {
            case 'excited':
                return 'sprite-excited';
            case 'active':
                return 'sprite-active';
            default:
                return 'sprite-idle';
        }
    };

    // 獲取當前選中的戰士
    const getCurrentSoldier = () => {
        return soldiersData.length > 0 ? soldiersData[selectedSoldierIndex] : null;
    };

    return (
        <>
            {/* Three-column layout */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                {/* Left sidebar: Forging result - 30% width */}
                <div className="lg:w-[30%] order-3 lg:order-1">
                    <div className="pixel-border bg-black/80 p-4 h-full flex flex-col">
                        <h2 className="text-xl font-bold mb-4 text-green-400 minecraft-font uppercase">
                            FORGING RESULT
                        </h2>

                        <div className="mb-4 p-3 bg-gray-800 border-2 border-gray-700 rounded">
                            <h3 className="text-sm font-semibold mb-1 text-yellow-300 minecraft-font uppercase">
                                CREATIVE PROMPT:
                            </h3>
                            <p className="text-gray-300 minecraft-font italic text-sm">
                                &quot;{prompt}&quot;
                            </p>
                        </div>

                        <div className="mb-6 p-3 bg-green-900/40 border-2 border-green-700 rounded">
                            <h3 className="text-sm font-semibold mb-1 text-green-400 minecraft-font uppercase">
                                GENERATION RESULT:
                            </h3>
                            <p className="text-gray-300 minecraft-font text-sm">
                                SUCCESSFULLY FORGED{' '}
                                <span className="text-yellow-300 font-bold">{tokenAmount}</span>{' '}
                                MEME TOKEN SOLDIERS!
                            </p>
                            <div className="mt-2 space-y-1">
                                <p className="text-gray-300 minecraft-font flex items-center text-sm">
                                    <span className="text-yellow-500 mr-2">→</span>
                                    <span>
                                        {Math.floor(tokenAmount / 2)} SOLDIERS READY TO DEPLOY
                                    </span>
                                </p>
                                <p className="text-gray-300 minecraft-font flex items-center text-sm">
                                    <span className="text-yellow-500 mr-2">→</span>
                                    <span>
                                        {Math.ceil(tokenAmount / 2)} SOLDIERS FOR YOUR WALLET
                                    </span>
                                </p>
                            </div>
                        </div>

                        {soldiersData.length > 0 && (
                            <div className="mb-6 p-3 bg-blue-900/40 border-2 border-blue-700 rounded">
                                <h3 className="text-sm font-semibold mb-2 text-blue-400 minecraft-font uppercase">
                                    YOUR MEME WARRIORS:
                                </h3>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {soldiersData.map((soldier, index) => (
                                        <div
                                            key={index}
                                            onClick={() => selectSoldier(index)}
                                            className={`w-16 h-16 relative cursor-pointer transition-all duration-200 ${selectedSoldierIndex === index ? 'border-2 border-yellow-400 scale-110' : 'border border-gray-700'}`}
                                        >
                                            <Image
                                                src={
                                                    soldier.image_url ||
                                                    '/images/soldier-placeholder.png'
                                                }
                                                alt={soldier.name || 'Meme Warrior'}
                                                width={64}
                                                height={64}
                                                className="pixelated object-cover w-full h-full"
                                                onError={(e) => {
                                                    // 縮略圖加載失敗時使用默認圖像
                                                    console.error('縮略圖加載失敗，使用默認圖像');
                                                    const target = e.target as HTMLImageElement;
                                                    target.onerror = null; // 防止無限循環
                                                    target.src = '/images/meme-soldier.png'; // 使用本地備用圖像
                                                }}
                                                unoptimized={true} // 禁用Next.js圖像優化，直接使用原始URL
                                            />
                                            {selectedSoldierIndex === index && (
                                                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-1 minecraft-font">
                                                    SELECTED
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-auto">
                            <div className="flex flex-col space-y-3">
                                <button
                                    onClick={handleDeploy}
                                    className="minecraft-btn w-full text-sm"
                                >
                                    DEPLOY TO BATTLEFIELD
                                </button>

                                <button
                                    onClick={handleKeep}
                                    className="minecraft-btn w-full text-sm"
                                >
                                    VIEW MY WALLET
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle column: Forge canvas - 40% width */}
                <div className="lg:w-[40%] order-1 lg:order-2">
                    <div
                        className="relative pixel-border overflow-hidden"
                        style={{ height: '70vh' }}
                    >
                        <div className="absolute inset-0">
                            <Image
                                src="/images/forge.png"
                                alt="Meme Forge"
                                fill
                                className="object-cover pixelated"
                            />
                        </div>

                        {/* MemeSoldier in the bottom-left corner */}
                        <div className="absolute bottom-4 left-4 z-10">
                            <Image
                                src="/images/meme-soldier.png"
                                alt="Meme Soldier"
                                width={64}
                                height={64}
                                className="pixelated"
                            />
                        </div>

                        {/* 中央展示當前選擇的戰士 */}
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                            {getCurrentSoldier() && (
                                <div className="flex flex-col items-center">
                                    <div
                                        className="pixel-border overflow-hidden bg-black/50 mb-3"
                                        style={{ width: '180px', height: '180px' }}
                                    >
                                        <Image
                                            src={soldierImage}
                                            alt={getCurrentSoldier()?.name || 'Meme Warrior'}
                                            width={180}
                                            height={180}
                                            className="pixelated object-cover"
                                            onError={(e) => {
                                                // 圖像加載失敗時使用默認圖像
                                                console.error('圖像加載失敗，使用默認圖像');
                                                const target = e.target as HTMLImageElement;
                                                target.onerror = null; // 防止無限循環
                                                target.src = '/images/meme-soldier.png'; // 使用本地備用圖像
                                            }}
                                            unoptimized={true} // 禁用Next.js圖像優化，直接使用原始URL
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-xl font-bold text-yellow-300 minecraft-font">
                                            {getCurrentSoldier()?.name || 'Unknown Warrior'}
                                        </h4>
                                        <p className="text-sm text-gray-300 minecraft-font mt-1">
                                            {getCurrentSoldier()?.prompt || prompt}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Completed teleport animation */}
                        <div className="absolute right-10 bottom-40 flex items-center">
                            <div className="teleport-pad"></div>
                        </div>
                    </div>
                </div>

                {/* Right sidebar: Soldier attributes - 30% width */}
                <div className="lg:w-[30%] order-2 lg:order-3">
                    <div className="pixel-border bg-black/80 p-4 h-full flex flex-col">
                        <h3 className="text-center font-bold mb-4 text-green-400 minecraft-font uppercase">
                            YOUR MEME SOLDIER
                        </h3>

                        <div className="mb-4 flex justify-center">
                            <div className="pixel-soldier w-24 h-24 flex items-center justify-center">
                                <Image
                                    src={soldierImage}
                                    alt={getCurrentSoldier()?.name || 'Meme Soldier'}
                                    width={96}
                                    height={96}
                                    className="pixelated object-cover"
                                    onError={(e) => {
                                        // 圖像加載失敗時使用默認圖像
                                        console.error('右側面板圖像加載失敗，使用默認圖像');
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null; // 防止無限循環
                                        target.src = '/images/meme-soldier.png'; // 使用本地備用圖像
                                    }}
                                    unoptimized={true} // 禁用Next.js圖像優化，直接使用原始URL
                                />
                            </div>
                        </div>

                        {getCurrentSoldier() && (
                            <div className="text-center mb-4">
                                <h4 className="text-lg text-yellow-300 minecraft-font">
                                    {getCurrentSoldier().name}
                                </h4>
                                <p className="text-xs text-gray-300 minecraft-font mt-1">
                                    {getCurrentSoldier().prompt || prompt}
                                </p>
                            </div>
                        )}

                        <div className="soldier-stats mt-2">
                            <div className="stat-bar">
                                <span className="minecraft-font text-white">HUMOR</span>
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
                                <span className="minecraft-font text-white">VIRALITY</span>
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
                                <span className="minecraft-font text-white">ORIGINALITY</span>
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
                                <span className="minecraft-font text-white">STRENGTH</span>
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
        </>
    );
}

// 主頁面組件
export default function ResultPage() {
    return (
        <div className="min-h-screen bg-gray-900 py-10 px-4 pixel-bg">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-yellow-300 text-center minecraft-font uppercase tracking-wide">
                    SOLDIER FORGED SUCCESSFULLY!
                </h1>

                <Suspense fallback={<div className="text-center text-white">載入中...</div>}>
                    <ResultContent />
                </Suspense>
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

                .teleport-pad {
                    width: 64px;
                    height: 24px;
                    background-color: #3b82f6;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                    box-shadow: 0 0 15px 5px #3b82f6;
                }

                .pixel-soldier {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: rgba(0, 0, 0, 0.3);
                    border: 2px solid #555;
                }

                .fallback-emoji {
                    font-size: 48px;
                    text-align: center;
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
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
                    background-color: #4aae46;
                    border: 3px solid #333;
                    color: white;
                    box-shadow: 3px 3px 0px #222;
                    position: relative;
                    transition: all 0.1s;
                    font-family: 'Minecraft', monospace;
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
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
                    background-color: #c43c3c;
                    border: 3px solid #333;
                    color: white;
                    box-shadow: 3px 3px 0px #222;
                    position: relative;
                    transition: all 0.1s;
                    font-family: 'Minecraft', monospace;
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
