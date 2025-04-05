'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 創意提示範例
const PROMPT_EXAMPLES = [
    '一隻戴著太陽眼鏡的狗狗，背景是爆炸場景',
    '哭泣的貓咪戴著皇冠',
    '恐龍穿西裝在開會',
    '像素風格的宇航員在月球上跳舞',
];

export default function SoldierPrep() {
    const [prompt, setPrompt] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showExamples, setShowExamples] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // 顯示打字動畫效果
    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
        setIsTyping(true);
        // 短暫延遲後停止打字效果
        setTimeout(() => setIsTyping(false), 1000);
    };

    const handleSubmit = () => {
        if (prompt.trim()) {
            // 提交後導航到確認頁面，將prompt作為查詢參數傳遞
            window.location.href = `/soldier-prep/confirm?prompt=${encodeURIComponent(prompt)}`;
        }
    };

    // 選擇範例提示詞
    const selectExample = (example: string) => {
        setPrompt(example);
        setShowExamples(false);
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
            {/* Pokemon風格的工廠場景 */}
            <div
                ref={containerRef}
                className="relative w-full max-w-2xl h-96 bg-white rounded-lg shadow-lg overflow-hidden mb-6"
            >
                <div className="absolute inset-0 bg-gray-200">
                    {/* 這裡將來放置Pokemon風格的工廠背景圖 */}
                    <div className="absolute left-0 top-0 w-1/2 h-1/2 border-r border-b border-gray-300 p-2">
                        {/* 左上角: 創意實驗室 */}
                        <div className="flex items-end h-full">
                            <div className="pixel-character scientist"></div>
                            <div className={`typing-bubble ${isTyping ? 'active' : ''}`}>
                                {isTyping ? '思考中...' : '請輸入你的meme創意！'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 提示詞輸入區 */}
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-center">創造你的Meme士兵</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">輸入你的創意提示詞:</label>
                    <textarea
                        value={prompt}
                        onChange={handlePromptChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        placeholder="描述你想要的meme，例如：'一隻戴著太陽眼鏡的狗狗，背景是爆炸場景'"
                    />
                </div>

                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={() => setShowExamples(!showExamples)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        {showExamples ? '隱藏範例' : '查看範例提示詞'}
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!prompt.trim()}
                        className={`px-4 py-2 rounded-md ${prompt.trim() ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                        下一步
                    </button>
                </div>

                {/* 範例提示詞 */}
                {showExamples && (
                    <div className="mt-4 border-t pt-4">
                        <h3 className="text-sm font-medium mb-2">創意提示範例:</h3>
                        <ul className="space-y-2">
                            {PROMPT_EXAMPLES.map((example, index) => (
                                <li
                                    key={index}
                                    onClick={() => selectExample(example)}
                                    className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                                >
                                    {example}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <style jsx>{`
                .pixel-character {
                    width: 32px;
                    height: 32px;
                    background-color: #555;
                }
                .scientist {
                    /* 臨時佔位，後續替換為實際的像素角色 */
                }
                .typing-bubble {
                    padding: 8px 12px;
                    background: white;
                    border: 2px solid #333;
                    border-radius: 12px;
                    position: relative;
                    margin-left: 8px;
                }
                .typing-bubble:before {
                    content: '';
                    position: absolute;
                    left: -10px;
                    top: 50%;
                    transform: translateY(-50%);
                    border-top: 8px solid transparent;
                    border-bottom: 8px solid transparent;
                    border-right: 10px solid white;
                }
                .typing-bubble.active:after {
                    content: '...';
                    animation: typing 1s infinite;
                }
                @keyframes typing {
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
