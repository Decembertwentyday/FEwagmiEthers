'use client';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { formatEther } from 'viem';

export default function WagmiBalance() {
    const { address, isConnected } = useAccount(); //isConnected  是否已连接

    const { data: balance, isLoading, refetch } = useReadContract({ // useReadContract  读取合约数据：调用的就是合约的view pure函数
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getBalance', // 函数名
        args: [address!], // 参数，数组形式
        query: {
            enabled: !!address, // 有地址才查询
        },
    });
    // refetch：手动刷新 重新获取 isLoading：首次加载中

    if (!isConnected) return <p>Please connect wallet</p>;
    if (isLoading) return <p>Loading balance...</p>;

    return (
        <div>
            <p>Your Balance: {formatEther(balance as bigint)} ETH</p>
            <button onClick={() => refetch()} className="bg-blue-500 text-white px-2 py-1 rounded">
                Refresh
            </button>
        </div>
    );
}
