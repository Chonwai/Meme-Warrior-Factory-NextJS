'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// 角色狀態類型
type CharacterState = 'idle' | 'active' | 'excited';

// Simulated AI dialogue
const AI_DIALOGUE = [
    'ANALYZING YOUR CREATIVE PROMPT...',
    'I SEE IT! THIS MEME HAS GREAT POTENTIAL!',
    'CONCEPTUALIZING THE BEST FORM OF EXPRESSION...',
    'PREPARING VISUAL ELEMENTS...',
    'ADJUSTING HUMOR AND VISUAL IMPACT...',
    'GENERATING PIXEL SOLDIER IMAGE...',
    'ASSIGNING BATTLE ATTRIBUTES...',
    'FINAL TOUCHES...',
    'COMPLETE! YOUR MEME SOLDIER IS BORN!',
];

// 客戶端組件 - 使用 searchParams
function GeneratingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [characterStates, setCharacterStates] = useState({
        blacksmith: 'active' as CharacterState,
        dispatcher: 'active' as CharacterState,
        memeSoldier: 'idle' as CharacterState,
    });
    const [generatedSoldiers, setGeneratedSoldiers] = useState<any[]>([]);
    const [isApiError, setIsApiError] = useState(false);

    // 處理搜索參數，只在 searchParams 變化時執行
    useEffect(() => {
        if (!searchParams) return;

        const promptParam = searchParams.get('prompt');
        if (promptParam) {
            setPrompt(decodeURIComponent(promptParam));
        } else {
            // If no prompt parameter, return to input page
            router.push('/soldier-prep');
        }
    }, [searchParams, router]);

    // 調用生成API獲取Meme戰士
    useEffect(() => {
        let isApiCompleted = false;
        let apiCleanupFunction: (() => void) | null = null;

        const fetchMemeWarriors = async () => {
            if (!prompt) return;

            // 開始模擬生成進度，不等待API響應
            apiCleanupFunction = simulateGenerationProgress();

            try {
                // 調用API生成Meme戰士
                const response = await fetch(
                    'https://meme-warrior-factory-backend.vercel.app/meme/generate',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ prompt }),
                    }
                );

                if (!response.ok) {
                    throw new Error('API請求失敗');
                }

                // 解析API返回結果
                const data = await response.json();

                if (data.success && data.items && data.items.length > 0) {
                    console.log('API返回的Meme戰士:', data.items);
                    setGeneratedSoldiers(data.items);

                    // API完成，標記狀態
                    isApiCompleted = true;

                    // 確保顯示100%進度
                    completeGenerationProcess();
                } else {
                    throw new Error('API返回數據無效');
                }
            } catch (error) {
                console.error('生成Meme戰士時出錯:', error);
                setIsApiError(true);

                // 即使出錯也標記為完成
                isApiCompleted = true;

                // 確保顯示100%進度，但有延遲讓用戶能看到進度動畫
                setTimeout(() => {
                    completeGenerationProcess();
                }, 2000);
            }
        };

        fetchMemeWarriors();

        // 完成生成過程
        const completeGenerationProcess = () => {
            // 設置進度為100%
            setProgress(100);

            // 設置最後一個對話
            setDialogueIndex(AI_DIALOGUE.length - 1);

            // 延遲一下，然後設置完成狀態
            setTimeout(() => {
                setIsComplete(true);
                // 角色狀態變化
                setCharacterStates({
                    blacksmith: 'idle' as CharacterState,
                    dispatcher: 'active' as CharacterState,
                    memeSoldier: 'excited' as CharacterState,
                });
            }, 1500);
        };

        // 組件卸載時清理
        return () => {
            if (apiCleanupFunction) {
                apiCleanupFunction();
            }
        };
    }, [prompt]);

    // 模擬生成進度
    const simulateGenerationProgress = () => {
        // 計算每個對話應該對應的進度百分比
        const progressPerDialogue = 100 / (AI_DIALOGUE.length - 1);

        // 設置初始值
        let currentIndex = 0;
        setDialogueIndex(0);
        setProgress(5); // 從5%開始

        // 模擬AI生成過程
        const dialogueInterval = setInterval(() => {
            currentIndex++;

            if (currentIndex >= AI_DIALOGUE.length - 1) {
                // 保留最後一個對話，讓API完成後顯示
                clearInterval(dialogueInterval);
                return;
            }

            // 更新對話索引和進度
            setDialogueIndex(currentIndex);

            // 進度增加，但不會立即達到100%
            // 保留最後10%的進度，直到API響應結束
            const progressLimit = Math.min(Math.round(currentIndex * progressPerDialogue), 90);
            setProgress(progressLimit);

            // 更新角色狀態
            updateCharacterStates(Math.round(currentIndex * progressPerDialogue));
        }, 2000);

        // 角色動畫效果，獨立於對話進度
        const characterInterval = setInterval(() => {
            // 隨機改變角色動畫狀態
            const randomValue = Math.random();
            if (randomValue > 0.7) {
                setCharacterStates((prev) => ({
                    ...prev,
                    blacksmith: prev.blacksmith === 'active' ? 'excited' : 'active',
                }));
            } else if (randomValue > 0.4) {
                setCharacterStates((prev) => ({
                    ...prev,
                    dispatcher: prev.dispatcher === 'idle' ? 'active' : 'idle',
                }));
            }
        }, 1500);

        // 返回清理函數
        return () => {
            clearInterval(dialogueInterval);
            clearInterval(characterInterval);
        };
    };

    // 更新角色狀態
    const updateCharacterStates = (currentProgress: number) => {
        if (currentProgress < 30) {
            setCharacterStates({
                blacksmith: 'active' as CharacterState,
                dispatcher: 'idle' as CharacterState,
                memeSoldier: 'idle' as CharacterState,
            });
        } else if (currentProgress < 60) {
            setCharacterStates({
                blacksmith: 'excited' as CharacterState,
                dispatcher: 'active' as CharacterState,
                memeSoldier: 'idle' as CharacterState,
            });
        } else if (currentProgress < 90) {
            setCharacterStates({
                blacksmith: 'active' as CharacterState,
                dispatcher: 'excited' as CharacterState,
                memeSoldier: 'active' as CharacterState,
            });
        } else {
            setCharacterStates({
                blacksmith: 'idle' as CharacterState,
                dispatcher: 'active' as CharacterState,
                memeSoldier: 'excited' as CharacterState,
            });
        }
    };

    const handleContinue = () => {
        // After completion, navigate to result page with generated soldiers data
        const soldierData = JSON.stringify(generatedSoldiers);
        router.push(
            `/soldier-prep/result?prompt=${encodeURIComponent(prompt)}&soldiers=${encodeURIComponent(soldierData)}`
        );
    };

    // Helper functions to get animation classes
    const getBlacksmithClass = () => {
        if (isComplete) return 'sprite-slow';
        switch (characterStates.blacksmith) {
            case 'excited':
                return 'sprite-excited';
            case 'active':
                return 'sprite-active';
            default:
                return 'sprite-idle';
        }
    };

    const getDispatcherClass = () => {
        if (isComplete) return 'sprite-slow';
        switch (characterStates.dispatcher) {
            case 'excited':
                return 'sprite-excited';
            case 'active':
                return 'sprite-active';
            default:
                return 'sprite-idle';
        }
    };

    const getMemeSoldierClass = () => {
        if (isComplete) return 'sprite-slow';
        switch (characterStates.memeSoldier) {
            case 'excited':
                return 'sprite-excited';
            case 'active':
                return 'sprite-active';
            default:
                return 'sprite-idle';
        }
    };

    return (
        <>
            {/* Three-column layout */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                {/* Left sidebar: AI dialogue - 30% width */}
                <div className="lg:w-[30%] order-2 lg:order-1">
                    <div className="pixel-border bg-black/80 p-4 h-full flex flex-col">
                        <h3 className="text-center font-bold mb-4 text-green-400 minecraft-font uppercase">
                            AI IS WORKING
                        </h3>
                        <div className="chat-bubble w-full mb-4">
                            <p className="minecraft-font text-white text-sm">
                                {AI_DIALOGUE[dialogueIndex]}
                            </p>
                        </div>

                        <div className="mt-auto">
                            <div className="mb-2 text-xs text-center text-gray-400 minecraft-font">
                                CREATIVE PROMPT:
                            </div>
                            <p className="text-gray-300 minecraft-font italic text-sm mb-4 text-center">
                                &quot;{prompt.substring(0, 30)}
                                {prompt.length > 30 ? '...' : ''}&quot;
                            </p>
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

                        {/* Blacksmith in the top-right corner */}
                        <div className="absolute top-32 right-8 z-10">
                            <Image
                                src="/images/blacksmith.png"
                                alt="Blacksmith"
                                width={64}
                                height={64}
                                className="pixelated"
                            />
                        </div>

                        {/* Dispatcher in the bottom-right corner */}
                        <div className="absolute bottom-4 right-4 z-10">
                            <Image
                                src="/images/dispatcher.png"
                                alt="Dispatcher"
                                width={64}
                                height={64}
                                className="pixelated"
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

                        {/* Central forge animation */}
                        <div className="absolute left-0 bottom-0 w-full h-full flex items-center justify-center">
                            <div
                                className={`pixel-forge-animation ${isComplete ? 'forge-complete' : ''}`}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Right sidebar: Generation status - 30% width */}
                <div className="lg:w-[30%] order-3">
                    <div className="pixel-border bg-black/80 p-4 h-full flex flex-col">
                        <h3 className="text-center font-bold mb-4 text-green-400 minecraft-font uppercase">
                            FORGING PROGRESS
                        </h3>

                        {/* Pixel-style progress indication */}
                        <div className="mb-6">
                            <div className="progress-container mb-2">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400 minecraft-font">0%</span>
                                <div className="bg-gray-800 px-3 py-1 rounded-md border border-gray-700">
                                    <span className="text-sm font-bold text-green-400 minecraft-font">
                                        {progress}%
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400 minecraft-font">100%</span>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 p-3 rounded mb-4">
                            <p className="text-xs text-gray-300 minecraft-font">
                                MINTING YOUR UNIQUE MEME SOLDIERS ON THE BLOCKCHAIN...
                            </p>
                        </div>

                        {isComplete && (
                            <div className="mt-auto">
                                <button onClick={handleContinue} className="minecraft-btn w-full">
                                    VIEW YOUR SOLDIER →
                                </button>
                            </div>
                        )}

                        {!isComplete && (
                            <div className="mt-auto text-center">
                                <p className="text-gray-400 minecraft-font pixel-loading">
                                    PLEASE WAIT
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

// 主頁面組件
export default function GeneratingPage() {
    return (
        <div className="min-h-screen bg-gray-900 py-10 px-4 pixel-bg">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-yellow-300 text-center minecraft-font uppercase tracking-wide">
                    SOLDIER FORGING IN PROGRESS
                </h1>

                <Suspense fallback={<div className="text-center text-white">載入中...</div>}>
                    <GeneratingContent />
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

                .progress-container {
                    height: 24px;
                    background-color: #222;
                    border: 2px solid #555;
                    padding: 4px;
                    position: relative;
                    overflow: hidden;
                }

                .progress-bar {
                    height: 100%;
                    background: linear-gradient(to right, #3b82f6, #10b981);
                    transition: width 0.5s ease-out;
                    position: relative;
                    box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
                }

                .progress-bar::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(
                        to right,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0.3) 50%,
                        rgba(255, 255, 255, 0) 100%
                    );
                    animation: progress-shine 1.5s infinite;
                }

                @keyframes progress-shine {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                .chat-bubble {
                    border-left: 3px solid #3b82f6;
                    padding: 8px 12px;
                    background-color: rgba(59, 130, 246, 0.1);
                }

                .pixel-forge-animation {
                    width: 64px;
                    height: 64px;
                    background-color: #ff6600;
                    opacity: 0.8;
                    border-radius: 50%;
                    box-shadow: 0 0 30px 15px #ff6600;
                    animation: forge 1.5s infinite alternate;
                }

                .forge-complete {
                    width: 96px;
                    height: 96px;
                    background-color: #22ddff;
                    box-shadow: 0 0 40px 20px #22ddff;
                }

                .pixel-loading:after {
                    content: '...';
                    animation: loading 1.5s infinite;
                }

                .minecraft-btn-gold {
                    display: inline-block;
                    padding: 8px 16px;
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
                    background-color: #ffaa00;
                    border: 3px solid #333;
                    color: white;
                    box-shadow: 3px 3px 0px #222;
                    position: relative;
                    transition: all 0.1s;
                    font-family: 'Minecraft', monospace;
                    letter-spacing: 1px;
                    cursor: pointer;
                }

                .minecraft-btn-gold:hover {
                    background-color: #ffbb33;
                    transform: translateY(-2px);
                }

                .minecraft-btn-gold:active {
                    background-color: #ee9900;
                    transform: translateY(2px);
                    box-shadow: 1px 1px 0px #222;
                }

                .pixelated {
                    image-rendering: pixelated;
                }

                @keyframes forge {
                    0% {
                        opacity: 0.6;
                        transform: scale(0.9);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1.1);
                    }
                }

                @keyframes loading {
                    0%,
                    100% {
                        content: '.';
                    }
                    33% {
                        content: '..';
                    }
                    66% {
                        content: '...';
                    }
                }
            `}</style>
        </div>
    );
}
