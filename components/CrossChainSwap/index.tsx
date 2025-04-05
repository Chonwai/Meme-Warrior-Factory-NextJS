'use client';

import { useState, useEffect } from 'react';
import { MiniKit, tokenToDecimals, Tokens } from '@worldcoin/minikit-js';

interface Token {
    symbol: string;
    name: string;
    address: string;
    logoURI?: string;
}

interface Chain {
    id: number;
    name: string;
    logoURI?: string;
}

// 支持的代幣列表
const supportedTokens: Record<number, Token[]> = {
    10: [
        // Optimism
        { symbol: 'WLD', name: 'WorldCoin', address: '0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1' },
        {
            symbol: 'USDC.e',
            name: 'USD Coin',
            address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        },
        {
            symbol: 'WETH',
            name: 'Wrapped Ether',
            address: '0x4200000000000000000000000000000000000006',
        },
        {
            symbol: 'WBTC',
            name: 'Wrapped Bitcoin',
            address: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
        },
    ],
    // 可以添加其他鏈的代幣
};

// 支持的鏈列表
const supportedChains: Chain[] = [
    { id: 10, name: 'Optimism' },
    { id: 8453, name: 'Base' },
    { id: 42161, name: 'Arbitrum' },
    { id: 137, name: 'Polygon' },
];

export const CrossChainSwap = () => {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [sourceChain, setSourceChain] = useState(supportedChains[0]);
    const [targetChain, setTargetChain] = useState(supportedChains[1]);
    const [sourceToken, setSourceToken] = useState<Token | null>(null);
    const [targetToken, setTargetToken] = useState<Token | null>(null);
    const [amount, setAmount] = useState('');
    const [estimatedAmount, setEstimatedAmount] = useState('');
    const [isDevMode, setIsDevMode] = useState(false);

    // 初始化
    useEffect(() => {
        // 初始化時設置默認代幣
        if (supportedTokens[sourceChain.id]?.length > 0) {
            setSourceToken(supportedTokens[sourceChain.id][0]);
        }
    }, [sourceChain]);

    // 檢查錢包連接狀態
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                // 嘗試初始化 MiniKit
                MiniKit.install();
                // 檢查MiniKit是否安裝
                const isMiniKitInstalled = MiniKit.isInstalled();
                setIsWalletConnected(isMiniKitInstalled);
            } catch (error) {
                console.log('Running in development mode (outside World App)');
                setIsDevMode(true);
            }
        }
    }, []);

    // 連接錢包
    const connectWallet = async () => {
        try {
            // 開發模式下模擬連接
            if (isDevMode) {
                console.log('DEV MODE: Simulating wallet connection');
                setIsWalletConnected(true);
                return;
            }

            // 正常模式 - MiniKit的錢包檢查
            // if (!MiniKit.isInstalled()) {
            //     console.error("MiniKit is not installed");
            //     return;
            // }
            setIsWalletConnected(true);
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    };

    // 執行跨鏈兌換
    const executeSwap = async () => {
        if (!isWalletConnected || !sourceToken || !amount) {
            console.error('Please connect wallet and enter amount');
            return;
        }

        try {
            // 開發模式下模擬交易
            if (isDevMode) {
                console.log('DEV MODE: Simulating swap transaction', {
                    sourceChain: sourceChain.name,
                    targetChain: targetChain.name,
                    sourceToken: sourceToken.symbol,
                    amount: amount,
                });
                // 模擬成功響應
                alert(
                    `模擬跨鏈兌換: ${amount} ${sourceToken.symbol} (${sourceChain.name}) → ${targetChain.name}`
                );
                return;
            }

            // 確認 MiniKit 已安裝
            if (!MiniKit.isInstalled()) {
                throw new Error('MiniKit is not installed or available');
            }

            // 根據代幣類型進行小數位數轉換
            let tokenAmount;
            try {
                // 嘗試使用 MiniKit 的 tokenToDecimals
                tokenAmount = tokenToDecimals(
                    parseFloat(amount),
                    sourceToken.symbol as Tokens
                ).toString();
            } catch (error) {
                // 如果失敗，手動處理不同代幣的小數位數
                const decimals = {
                    'USDC.e': 6,
                    WBTC: 8,
                    WETH: 18,
                    WLD: 18,
                };
                const tokenDecimals = decimals[sourceToken.symbol as keyof typeof decimals] || 18;
                tokenAmount = (parseFloat(amount) * Math.pow(10, tokenDecimals)).toString();
            }

            // 使用MiniKit的pay函數實現基礎付款功能
            const response = await MiniKit.commandsAsync.pay({
                reference: 'cross-chain-swap',
                to: '0x0c892815f0B058E69987920A23FBb33c834289cf', // 測試地址
                tokens: [
                    {
                        symbol: sourceToken.symbol as Tokens,
                        token_amount: tokenAmount,
                    },
                ],
                description: `Cross-chain swap from ${sourceChain.name} to ${targetChain.name}`,
            });

            console.log('Swap initiated:', response);
        } catch (error) {
            console.error('Error executing swap:', error);

            // 顯示更友好的錯誤信息
            if (error instanceof Error && error.message.includes('pay command is unavailable')) {
                alert('交易功能暫時不可用: 需要在World App內運行此應用程式或更新至最新版本。');
            } else {
                alert(`交易失敗: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">跨鏈兌換</h2>

            {isDevMode && !isWalletConnected && (
                <div className="mb-4 p-2 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-300 text-sm">
                    開發模式：此應用程式設計在World App內運行。點擊下方按鈕模擬連接錢包。
                </div>
            )}

            {!isWalletConnected ? (
                <button
                    onClick={connectWallet}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    連接錢包
                </button>
            ) : (
                <div className="space-y-4">
                    {/* 源鏈選擇 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            源鏈 (目前僅支持 Optimism)
                        </label>
                        <select
                            className="w-full p-2 bg-gray-700 text-white rounded"
                            value={sourceChain.id}
                            onChange={(e) => {
                                const chain = supportedChains.find(
                                    (c) => c.id === parseInt(e.target.value)
                                );
                                if (chain) setSourceChain(chain);
                            }}
                            disabled // 目前鎖定為Optimism，因為WorldCoin只在該鏈上
                        >
                            {supportedChains.map((chain) => (
                                <option key={chain.id} value={chain.id}>
                                    {chain.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 源代幣選擇 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            源代幣
                        </label>
                        <select
                            className="w-full p-2 bg-gray-700 text-white rounded"
                            value={sourceToken?.symbol || ''}
                            onChange={(e) => {
                                const token = supportedTokens[sourceChain.id].find(
                                    (t) => t.symbol === e.target.value
                                );
                                if (token) setSourceToken(token);
                            }}
                        >
                            {supportedTokens[sourceChain.id]?.map((token) => (
                                <option key={token.symbol} value={token.symbol}>
                                    {token.name} ({token.symbol})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 金額輸入 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">金額</label>
                        <input
                            type="number"
                            className="w-full p-2 bg-gray-700 text-white rounded"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="輸入金額"
                        />
                    </div>

                    {/* 目標鏈選擇 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            目標鏈
                        </label>
                        <select
                            className="w-full p-2 bg-gray-700 text-white rounded"
                            value={targetChain.id}
                            onChange={(e) => {
                                const chain = supportedChains.find(
                                    (c) => c.id === parseInt(e.target.value)
                                );
                                if (chain) setTargetChain(chain);
                            }}
                        >
                            {supportedChains
                                .filter((chain) => chain.id !== sourceChain.id)
                                .map((chain) => (
                                    <option key={chain.id} value={chain.id}>
                                        {chain.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* 兌換按鈕 */}
                    <button
                        onClick={executeSwap}
                        className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
                        disabled={!sourceToken || !amount}
                    >
                        跨鏈兌換
                    </button>
                </div>
            )}
        </div>
    );
};
