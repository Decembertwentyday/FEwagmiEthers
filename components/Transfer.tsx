'use client';
import { useWriteContract, useWaitForTransactionReceipt, useSimulateContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { parseEther } from 'viem';
import {useEffect, useState} from 'react';

export default function Transfer({ onSuccess}: { onSuccess: () => void }) {
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    useEffect(() => {
        if (isSuccess) onSuccess();
    }, [isSuccess, onSuccess]);
    const { data: hash, writeContract, isPending } = useWriteContract();

    const transfer = () => {
        if (!to || !amount) return;
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'transfer',
            args: [to, parseEther(amount)],
        });
    };

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    return (
        <div className="mt-4">
            <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Recipient address"
                className="border p-1"
            />
            <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount in ETH"
                className="border p-1 ml-2"
            />
            <button
                onClick={transfer}
                disabled={isPending || isConfirming}
                className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
                {isPending ? 'Confirm in wallet...' : isConfirming ? 'Transferring...' : 'Transfer'}
            </button>
            {isSuccess && <p className="text-green-600">Transfer successful!</p>}
        </div>
    );
}
