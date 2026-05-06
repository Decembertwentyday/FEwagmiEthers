'use client';
import { useState, useEffect } from 'react';
import { getEthersContract } from '@/lib/ethers';
import { formatEther } from 'ethers';
//
export default function EthersBalance() {
    const [balance, setBalance] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchBalance = async () => {
        setLoading(true);
        try {
            const contract = await getEthersContract();
            const address = await contract.runner?.getAddress(); // 当前签名者地址
            if (address) {
                const bal = await contract.getBalance(address);
                setBalance(formatEther(bal));
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    return (
        <div>
            <p>Ethers Balance: {balance !== null ? `${balance} ETH` : 'Not loaded'}</p>
            <button onClick={fetchBalance} className="bg-gray-200 px-2 py-1 rounded">Refresh</button>
        </div>
    );
}
