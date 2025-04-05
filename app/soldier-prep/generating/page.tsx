'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// 模擬AI對話
const AI_DIALOGUE = [
    '正在分析你的創意提示詞...',
    '我看到了！這個meme的潛力非常棒！',
    '開始構思最佳的表現形式...',
    '正在準備視覺元素...',
    '調整幽默度和視覺衝擊力...',
    '生成像素士兵圖像中...',
    '賦予士兵戰鬥屬性...',
    '最終潤色...',
    '完成！你的Meme士兵誕生了！',
];

export default function GeneratingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const promptParam = searchParams.get('prompt');
        if (promptParam) {
            setPrompt(decodeURIComponent(promptParam));
        } else {
            // 如果沒有提示詞參數，返回輸入頁面
            router.push('/soldier-prep');
        }

        // 模擬AI生成過程
        const dialogueInterval = setInterval(() => {
            setDialogueIndex((prev) => {
                if (prev < AI_DIALOGUE.length - 1) {
                    return prev + 1;
                } else {
                    clearInterval(dialogueInterval);
                    // 最後一條對話後設置完成狀態
                    setTimeout(() => setIsComplete(true), 1500);
                    return prev;
                }
            });
        }, 2000);

        // 進度條動畫
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 100) {
                    return prev + 1;
                } else {
                    clearInterval(progressInterval);
                    return 100;
                }
            });
        }, 180); // 大約18秒完成

        return () => {
            clearInterval(dialogueInterval);
            clearInterval(progressInterval);
        };
    }, [searchParams, router]);

    const handleContinue = () => {
        // 完成後導航到結果頁面
        router.push(`/soldier-prep/result?prompt=${encodeURIComponent(prompt)}`);
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
            {/* Pokemon風格的工廠場景 - 右下角：訓練場 */}
            <div className="relative w-full max-w-2xl h-96 bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gray-200">
                    {/* 這裡將來放置Pokemon風格的工廠背景圖 */}
                    <div className="absolute left-0 bottom-0 w-1/2 h-1/2 border-r border-t border-gray-300 p-2">
                        {/* 左下角: 訓練場 */}
                        <div className="flex items-start h-full justify-end">
                            <div className="pixel-fire-animation"></div>
                            <div className="pixel-character drill-sergeant"></div>
                        </div>
                    </div>
                </div>

                {/* 中央顯示當前生成進度 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6">
                    <div className="w-full max-w-xs bg-white rounded-lg shadow-md p-4">
                        <h3 className="font-bold mb-2 text-center">AI正在工作中</h3>
                        <p className="chat-bubble mb-4">{AI_DIALOGUE[dialogueIndex]}</p>

                        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                            <div
                                className="bg-blue-500 h-4 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-right">{progress}%</p>
                    </div>
                </div>
            </div>

            {/* 控制區域 */}
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-center">生成你的Meme士兵</h2>

                <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
                    <h3 className="text-sm font-semibold mb-2">你的創意提示詞:</h3>
                    <p className="italic">"{prompt}"</p>
                </div>

                {isComplete ? (
                    <div className="flex justify-center">
                        <button
                            onClick={handleContinue}
                            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                        >
                            查看你的士兵
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <p className="text-gray-500">請稍候，AI正在創造你的士兵...</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .pixel-character {
                    width: 32px;
                    height: 32px;
                    background-color: #555;
                }
                .drill-sergeant {
                    /* 臨時佔位，後續替換為實際的教官角色 */
                }
                .pixel-fire-animation {
                    width: 32px;
                    height: 32px;
                    background-color: #ff6600;
                    opacity: 0.8;
                    animation: flicker 0.5s infinite alternate;
                }
                .chat-bubble {
                    position: relative;
                    padding: 8px 12px;
                    background: #f0f9ff;
                    border-radius: 8px;
                    border-left: 3px solid #3b82f6;
                }
                @keyframes flicker {
                    0% {
                        opacity: 0.5;
                        transform: scale(0.95);
                    }
                    100% {
                        opacity: 0.8;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
