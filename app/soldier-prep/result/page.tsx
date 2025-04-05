"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// 模擬士兵屬性
const SOLDIER_ATTRIBUTES = {
  humor: 0,
  virality: 0,
  originality: 0,
  strength: 0
};

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [attributes, setAttributes] = useState(SOLDIER_ATTRIBUTES);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [soldierImage, setSoldierImage] = useState('/placeholder-soldier.png');
  
  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    if (promptParam) {
      setPrompt(decodeURIComponent(promptParam));
      
      // 模擬生成士兵屬性（實際應從AI服務獲取）
      setAttributes({
        humor: Math.floor(Math.random() * 100),
        virality: Math.floor(Math.random() * 100),
        originality: Math.floor(Math.random() * 100),
        strength: Math.floor(Math.random() * 100)
      });
      
      // 模擬代幣數量（實際應從智能合約獲取）
      setTokenAmount(Math.floor(Math.random() * 1000) + 100);
      
      // 實際項目中這裡應該獲取真實生成的圖像URL
    } else {
      // 如果沒有提示詞參數，返回輸入頁面
      router.push('/soldier-prep');
    }
  }, [searchParams, router]);
  
  const handleDeploy = () => {
    // 部署到戰場（實際項目中應調用智能合約）
    router.push('/battlefield');
  };
  
  const handleKeep = () => {
    // 保存到錢包（實際項目中應調用智能合約）
    router.push('/wallet');
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
      {/* Pokemon風格的工廠場景 - 右下角：部署中心 */}
      <div className="relative w-full max-w-2xl h-96 bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gray-200">
          {/* 這裡將來放置Pokemon風格的工廠背景圖 */}
          <div className="absolute right-0 bottom-0 w-1/2 h-1/2 border-l border-t border-gray-300 p-2">
            {/* 右下角: 部署中心 */}
            <div className="flex items-start h-full">
              <div className="pixel-character dispatcher"></div>
              <div className="teleport-pad"></div>
            </div>
          </div>
        </div>
        
        {/* 中央顯示生成的士兵 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="soldier-container">
            <div className="soldier-image-container">
              {/* 實際項目中這裡應該是動態生成的士兵圖像 */}
              <div className="placeholder-soldier"></div>
            </div>
            <div className="soldier-stats">
              <h3 className="text-center font-bold mb-2">Meme士兵</h3>
              <div className="stat-bar">
                <span>幽默值</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: `${attributes.humor}%` }}></div>
                </div>
                <span>{attributes.humor}</span>
              </div>
              <div className="stat-bar">
                <span>傳播力</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: `${attributes.virality}%` }}></div>
                </div>
                <span>{attributes.virality}</span>
              </div>
              <div className="stat-bar">
                <span>原創性</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: `${attributes.originality}%` }}></div>
                </div>
                <span>{attributes.originality}</span>
              </div>
              <div className="stat-bar">
                <span>戰鬥力</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: `${attributes.strength}%` }}></div>
                </div>
                <span>{attributes.strength}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 控制區域 */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-center">你的Meme士兵已準備就緒！</h2>
        
        <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
          <h3 className="text-sm font-semibold mb-2">創意提示詞:</h3>
          <p className="italic">"{prompt}"</p>
        </div>
        
        <div className="mb-6 bg-green-50 p-4 rounded border border-green-200">
          <h3 className="text-sm font-semibold mb-2">生成結果:</h3>
          <p>已成功鑄造 <span className="font-bold">{tokenAmount}</span> 個Meme代幣士兵！</p>
          <p className="text-sm mt-2">
            • {Math.floor(tokenAmount/2)} 個士兵準備部署到戰場<br />
            • {Math.ceil(tokenAmount/2)} 個士兵可以保存在你的錢包中
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={handleDeploy}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          >
            立即部署到戰場
          </button>
          
          <button 
            onClick={handleKeep}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            查看我的錢包
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .pixel-character {
          width: 32px;
          height: 32px;
          background-color: #555;
        }
        .dispatcher {
          /* 臨時佔位，後續替換為實際的調度員角色 */
        }
        .teleport-pad {
          width: 48px;
          height: 24px;
          background-color: #3b82f6;
          border-radius: 50%;
          margin-left: 8px;
          animation: pulse 2s infinite;
        }
        .soldier-container {
          display: flex;
          background: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          max-width: 80%;
        }
        .soldier-image-container {
          width: 120px;
          height: 120px;
          margin-right: 16px;
        }
        .placeholder-soldier {
          width: 100%;
          height: 100%;
          background-color: #ddd;
          border: 2px solid #aaa;
        }
        .soldier-stats {
          flex: 1;
        }
        .stat-bar {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          font-size: 12px;
        }
        .bar-container {
          flex: 1;
          height: 8px;
          background-color: #eee;
          border-radius: 4px;
          margin: 0 8px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background-color: #3b82f6;
          border-radius: 4px;
        }
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: 0.6; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
} 