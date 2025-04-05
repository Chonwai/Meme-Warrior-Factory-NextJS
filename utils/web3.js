import { createPublicClient, createWalletClient, custom, parseEther } from 'viem';
import { celoAlfajores, celo } from 'viem/chains';

// 合約地址，應從環境變量獲取
const REWARD_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS || '您的MemeWarriorsReward合約地址';

// MemeWarriorsReward合約ABI
const MemeWarriorsRewardABI = [
    // 投票功能
    {
        inputs: [
            { internalType: 'uint256', name: 'battleId', type: 'uint256' },
            { internalType: 'uint256', name: 'teamId', type: 'uint256' },
        ],
        name: 'voteForTeam',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    // 獲取戰鬥信息
    {
        inputs: [{ internalType: 'uint256', name: 'battleId', type: 'uint256' }],
        name: 'getBattle',
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'team1Id', type: 'uint256' },
                    { internalType: 'uint256', name: 'team2Id', type: 'uint256' },
                    { internalType: 'uint256', name: 'startTime', type: 'uint256' },
                    { internalType: 'uint256', name: 'endTime', type: 'uint256' },
                    { internalType: 'uint256', name: 'winningTeamId', type: 'uint256' },
                    { internalType: 'bool', name: 'isEnded', type: 'bool' },
                    { internalType: 'uint256', name: 'totalVotes', type: 'uint256' },
                    { internalType: 'uint256', name: 'rewardPool', type: 'uint256' },
                ],
                internalType: 'struct MemeWarriorsReward.Battle',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    // 獲取用戶投票
    {
        inputs: [
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'uint256', name: '', type: 'uint256' },
        ],
        name: 'userVotes',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    // 領取獎勵
    {
        inputs: [{ internalType: 'uint256', name: 'battleId', type: 'uint256' }],
        name: 'claimReward',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    // 戰鬥計數器
    {
        inputs: [],
        name: 'battleCounter',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
];

/**
 * 獲取當前連接的錢包地址
 */
export const getWalletAddress = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask未安裝或不可用');
    }

    try {
        // 複用createContractClients函數的功能
        const { walletClient } = await createContractClients();
        const [address] = await walletClient.getAddresses();
        return address;
    } catch (error) {
        console.error('獲取錢包地址失敗:', error);
        throw error;
    }
};

/**
 * 建立與智能合約的交互客戶端
 */
export const createContractClients = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask未安裝或不可用');
    }

    try {
        // 獲取當前連接的鏈ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        // 創建自定義鏈配置
        const createChainConfig = (chainId) => {
            // 為Celo測試網使用預定義的配置
            if (chainId === '0xaef3') {
                return celoAlfajores;
            }

            // 為Celo主網使用預定義的配置
            if (chainId === '0xa4ec') {
                return celo;
            }

            // 為World Chain創建自定義配置
            if (chainId === '0x3a44') {
                // World Chain ID
                return {
                    id: parseInt(chainId, 16),
                    name: 'World Chain',
                    nativeCurrency: {
                        name: 'World Chain',
                        symbol: 'WO',
                        decimals: 18,
                    },
                    rpcUrls: {
                        default: {
                            http: ['https://mainnet.worldchain.network'],
                        },
                        public: {
                            http: ['https://mainnet.worldchain.network'],
                        },
                    },
                    blockExplorers: {
                        default: {
                            name: 'World Chain Explorer',
                            url: 'https://explorer.worldchain.network',
                        },
                    },
                };
            }

            // 為Flow Testnet創建自定義配置
            if (chainId === '0x221') {
                return {
                    id: parseInt(chainId, 16),
                    name: 'Flow Testnet',
                    nativeCurrency: {
                        name: 'Flow',
                        symbol: 'FLOW',
                        decimals: 18,
                    },
                    rpcUrls: {
                        default: {
                            http: ['https://testnet.evm.nodes.onflow.org'],
                        },
                        public: {
                            http: ['https://testnet.evm.nodes.onflow.org'],
                        },
                    },
                    blockExplorers: {
                        default: {
                            name: 'FlowScan',
                            url: 'https://evm-testnet.flowscan.io',
                        },
                    },
                };
            }

            // 如果是不支持的鏈ID，使用Celo測試網作為默認值
            console.warn(`不支持的鏈ID: ${chainId}, 使用默認的Celo Alfajores`);
            return celoAlfajores;
        };

        // 根據鏈ID獲取適當的鏈配置
        const chain = createChainConfig(chainId);

        // 創建公共客戶端用於讀取合約狀態
        const publicClient = createPublicClient({
            chain: chain,
            transport: custom(window.ethereum),
        });

        // 創建錢包客戶端用於發送交易
        const walletClient = createWalletClient({
            chain: chain,
            transport: custom(window.ethereum),
        });

        return { publicClient, walletClient };
    } catch (error) {
        console.error('建立合約客戶端失敗:', error);
        throw error;
    }
};

/**
 * 投票給指定團隊
 * @param {number} battleId - 戰鬥ID
 * @param {number} teamId - 團隊ID
 * @returns {Promise<string>} - 交易哈希
 */
export const voteForTeam = async (battleId, teamId) => {
    try {
        const { walletClient, publicClient } = await createContractClients();
        const [address] = await walletClient.getAddresses();

        // 發送投票交易
        const hash = await walletClient.writeContract({
            address: REWARD_CONTRACT_ADDRESS,
            abi: MemeWarriorsRewardABI,
            functionName: 'voteForTeam',
            args: [BigInt(battleId), BigInt(teamId)],
            account: address,
        });

        console.log('投票交易已提交，哈希：', hash);

        // 等待交易確認
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log('投票交易已確認：', receipt);

        return hash;
    } catch (error) {
        console.error('投票失敗:', error);
        throw error;
    }
};

/**
 * 獲取用戶對特定戰鬥的投票
 * @param {number} battleId - 戰鬥ID
 * @returns {Promise<number>} - 用戶投票的團隊ID
 */
export const getUserVote = async (battleId) => {
    try {
        const { publicClient } = await createContractClients();
        const address = await getWalletAddress();

        const vote = await publicClient.readContract({
            address: REWARD_CONTRACT_ADDRESS,
            abi: MemeWarriorsRewardABI,
            functionName: 'userVotes',
            args: [address, BigInt(battleId)],
        });

        return Number(vote);
    } catch (error) {
        console.error('獲取用戶投票失敗:', error);
        throw error;
    }
};

/**
 * 獲取戰鬥詳情
 * @param {number} battleId - 戰鬥ID
 * @returns {Promise<object>} - 戰鬥詳情
 */
export const getBattle = async (battleId) => {
    try {
        const { publicClient } = await createContractClients();

        const battle = await publicClient.readContract({
            address: REWARD_CONTRACT_ADDRESS,
            abi: MemeWarriorsRewardABI,
            functionName: 'getBattle',
            args: [BigInt(battleId)],
        });

        return {
            team1Id: Number(battle.team1Id),
            team2Id: Number(battle.team2Id),
            startTime: new Date(Number(battle.startTime) * 1000),
            endTime: new Date(Number(battle.endTime) * 1000),
            winningTeamId: Number(battle.winningTeamId),
            isEnded: battle.isEnded,
            totalVotes: Number(battle.totalVotes),
            rewardPool: Number(battle.rewardPool) / 1e18,
        };
    } catch (error) {
        console.error('獲取戰鬥詳情失敗:', error);
        throw error;
    }
};

/**
 * 領取獎勵
 * @param {number} battleId - 戰鬥ID
 * @returns {Promise<string>} - 交易哈希
 */
export const claimReward = async (battleId) => {
    try {
        const { walletClient, publicClient } = await createContractClients();
        const [address] = await walletClient.getAddresses();

        // 發送領取獎勵交易
        const hash = await walletClient.writeContract({
            address: REWARD_CONTRACT_ADDRESS,
            abi: MemeWarriorsRewardABI,
            functionName: 'claimReward',
            args: [BigInt(battleId)],
            account: address,
        });

        console.log('領取獎勵交易已提交，哈希：', hash);

        // 等待交易確認
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log('領取獎勵交易已確認：', receipt);

        return hash;
    } catch (error) {
        console.error('領取獎勵失敗:', error);
        throw error;
    }
};
