import axios from 'axios';
import { FusionSDK, NetworkEnum } from '@1inch/fusion-sdk';

// 映射WorldCoin支持的鏈到1inch網絡枚舉
const chainIdToNetwork: Record<number, NetworkEnum> = {
    10: NetworkEnum.OPTIMISM, // Optimism (WorldCoin主要鏈)
    42161: NetworkEnum.ARBITRUM, // Arbitrum
    137: NetworkEnum.POLYGON, // Polygon
    1: NetworkEnum.ETHEREUM, // Ethereum
};

// 初始化FusionSDK (稍後添加密鑰)
const initFusionSDK = (chainId: number) => {
    const network = chainIdToNetwork[chainId];
    if (!network) throw new Error(`Chain ID ${chainId} not supported by 1inch`);

    return new FusionSDK({
        url: 'https://fusion.1inch.io',
        network,
    });
};

// 獲取代幣價格
export const getTokenPrice = async (chainId: number, tokenAddress: string) => {
    try {
        const response = await axios.get(
            `https://api.1inch.io/v5.0/${chainId}/quote?fromTokenAddress=${tokenAddress}&toTokenAddress=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&amount=1000000000000000000`
        );
        return response.data;
    } catch (error) {
        console.error('Error getting token price:', error);
        throw error;
    }
};

// 獲取用戶餘額
export const getWalletBalances = async (chainId: number, walletAddress: string) => {
    try {
        const response = await axios.get(
            `https://api.1inch.io/v5.0/${chainId}/balances?walletAddress=${walletAddress}`
        );
        return response.data;
    } catch (error) {
        console.error('Error getting wallet balances:', error);
        throw error;
    }
};

export { initFusionSDK };
