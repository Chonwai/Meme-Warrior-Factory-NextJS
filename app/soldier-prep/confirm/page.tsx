'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ConfirmPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);

    useEffect(() => {
        const promptParam = searchParams.get('prompt');
        if (promptParam) {
            setPrompt(decodeURIComponent(promptParam));
        } else {
            // 如果沒有提示詞參數，返回輸入頁面
            router.push('/soldier-prep');
        }
    }, [searchParams, router]);

    const handleConfirm = () => {
        if (isAgreed && prompt) {
            // 導航到生成頁面，繼續傳遞prompt參數
            router.push(`/soldier-prep/generating?prompt=${encodeURIComponent(prompt)}`);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
            {/* Pokemon風格的工廠場景 - 中左區域：鑄造熔爐 */}
            <div className="relative w-full max-w-2xl h-96 bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gray-200">
                    {/* 這裡將來放置Pokemon風格的工廠背景圖 */}
                    <div className="absolute left-1/2 top-0 w-1/2 h-1/2 border-l border-b border-gray-300 p-2">
                        {/* 右上角: 鑄造熔爐 */}
                        <div className="flex items-end h-full">
                            <div className="pixel-character blacksmith"></div>
                            <div className="speech-bubble">準備好鑄造你的士兵了嗎？</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 確認區域 */}
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-center">確認你的Meme士兵創建</h2>

                <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
                    <h3 className="text-sm font-semibold mb-2">你的創意提示詞:</h3>
                    <p className="italic">"{prompt}"</p>
                </div>

                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <h3 className="text-sm font-semibold mb-2">請注意:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>50%的生成代幣將自動部署到戰場</li>
                        <li>部署的士兵可能在戰鬥中損失</li>
                        <li>剩餘50%將保存在你的錢包中</li>
                        <li>每次生成將消耗少量gas費</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <label className="flex items-start">
                        <input
                            type="checkbox"
                            checked={isAgreed}
                            onChange={() => setIsAgreed(!isAgreed)}
                            className="mt-1 mr-2"
                        />
                        <span className="text-sm">
                            我同意將50%的代幣部署到戰場，並了解這些代幣可能在戰鬥中損失。
                        </span>
                    </label>
                </div>

                <div className="flex justify-between">
                    <Link
                        href="/soldier-prep"
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        返回修改
                    </Link>

                    <button
                        onClick={handleConfirm}
                        disabled={!isAgreed}
                        className={`px-4 py-2 rounded-md ${isAgreed ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                        確認並生成
                    </button>
                </div>
            </div>

            <style jsx>{`
                .pixel-character {
                    width: 32px;
                    height: 32px;
                    background-color: #555;
                }
                .blacksmith {
                    /* 臨時佔位，後續替換為實際的鑄幣師角色 */
                }
                .speech-bubble {
                    padding: 8px 12px;
                    background: white;
                    border: 2px solid #333;
                    border-radius: 12px;
                    position: relative;
                    margin-left: 8px;
                }
                .speech-bubble:before {
                    content: '';
                    position: absolute;
                    left: -10px;
                    top: 50%;
                    transform: translateY(-50%);
                    border-top: 8px solid transparent;
                    border-bottom: 8px solid transparent;
                    border-right: 10px solid white;
                }
            `}</style>
        </div>
    );
}
