'use client';

import { useState } from 'react';
import { voteForTeam } from '@/utils/web3';
import { useWallet } from '@/lib/wallet-context';

interface VoteButtonProps {
    battleId: number;
    teamId: number;
    className?: string;
    onVoteSuccess?: (battleId: number, teamId: number) => void;
}

export default function VoteButton({
    battleId,
    teamId,
    className = '',
    onVoteSuccess,
}: VoteButtonProps) {
    const [isVoting, setIsVoting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isConnected, connectWallet } = useWallet();

    const handleVote = async () => {
        setIsVoting(true);
        setError(null);

        try {
            // 檢查錢包是否已連接
            if (!isConnected) {
                await connectWallet();
            }

            // 執行投票交易
            await voteForTeam(battleId, teamId);

            // 設置成功狀態並顯示短暫確認信息
            setIsSuccess(true);

            // 投票成功，觸發回調
            if (onVoteSuccess) {
                onVoteSuccess(battleId, teamId);
            }

            // 2秒後重置按鈕狀態
            setTimeout(() => {
                setIsSuccess(false);
            }, 2000);
        } catch (err) {
            console.error('投票出錯：', err);
            setError(err instanceof Error ? err.message : '投票失敗，請重試');
        } finally {
            setIsVoting(false);
        }
    };

    // 基本按鈕樣式
    const baseClassName = 'minecraft-btn text-xs';

    return (
        <div className="relative">
            <button
                onClick={handleVote}
                disabled={isVoting || isSuccess}
                className={`
                    ${baseClassName} 
                    ${className} 
                    ${isVoting ? 'opacity-70 cursor-not-allowed' : ''} 
                    ${isSuccess ? 'bg-green-600 border-green-800' : ''}
                `}
            >
                {isVoting ? 'Voting...' : isSuccess ? 'VOTED!' : 'VOTE'}
            </button>

            {error && (
                <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-red-800 text-white text-xs minecraft-font">
                    {error}
                </div>
            )}
        </div>
    );
}
