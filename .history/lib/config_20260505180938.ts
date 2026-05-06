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