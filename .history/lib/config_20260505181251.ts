import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { hardhat } from 'wagmi/chains';
import { http } from 'viem';

export const config = getDefaultConfig({
  appName: 'My Web3 Wallet App',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // 可以先用 'YOUR_PROJECT_ID' 占位，本地不需要真实
  chains: [hardhat],
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
});

// 1. 导入所需模块
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';
import { http } from 'viem';

// 2. 创建配置对象
export const config = getDefaultConfig({ //   
  appName: 'My Blog DApp',              // 显示在RainbowKit弹窗中的App名称
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // 必须替换！
  chains: [mainnet, sepolia, hardhat],           // 支持的区块链网络
  transports: {                         // 每个网络的RPC通信方式
    [mainnet.id]: http(),               // 主网使用公共RPC（有限速，生产环境要换成Infura等）
    [sepolia.id]: http('https://sepolia.infura.io/v3/你的INFURA_KEY'),
    
  },
});