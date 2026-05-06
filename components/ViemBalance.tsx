'use client';
import { useAccount, usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { formatEther } from 'viem';
import { useEffect, useState } from 'react';

export default function ViemBalance() {
    const { address } = useAccount(); // 获取用户地址
    const publicClient = usePublicClient(); // 拿到公共客户端
    const [balance, setBalance] = useState<string>();
    const [loading, setLoading] = useState(false);

    const fetchBalance = async () => {
        if (!address || !publicClient) return;
        setLoading(true);
        try {
            const data = await publicClient.readContract({ // 使用公共客户端里有内置的读取合约数据的方法  参数为合约地址、abi、方法名、参数
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'getBalance',
                args: [address],
            });
            setBalance(formatEther(data as bigint) + ' ETH');
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };
    useEffect(() => {
        fetchBalance();
    }, [address, publicClient]);

    return (
        <div>
            <p>Viem Balance: {loading ? 'Loading...' : balance ?? 'Unknown'}</p>
            <button onClick={fetchBalance} className="bg-gray-200 px-2 py-1 rounded">
                Refresh
            </button>
            <button onclick={fetchBalance}>重新获取</button>
        </div>
    );
}