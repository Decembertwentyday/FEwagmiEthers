'use client';
import { useAccount } from 'wagmi';
import { useEthersContractFromWagmi } from '@/hooks/useEthersContractFromWagmi';
import { formatEther } from 'ethers';
import { useEffect, useState } from 'react';

export default function WagmiEthersBalance() {
    const { address } = useAccount();
    const contract = useEthersContractFromWagmi();
    const [balance, setBalance] = useState<string>();

    useEffect(() => {
        if (!contract || !address) return;
        contract.getBalance(address).then(b => setBalance(formatEther(b)));
    }, [contract, address]);

    return <p>Balance (via ethers): {balance} ETH</p>;
}
