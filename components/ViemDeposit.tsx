'use client';
import { useWalletClient, usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { parseEther } from 'viem';
import { useState, useEffect } from 'react';

export default function ViemDeposit({ onSuccess }: { onSuccess: () => void }) {
    const { data: walletClient } = useWalletClient(); // 拿到钱包客户端 进行写入 转账 合约调用
    const publicClient = usePublicClient(); // 拿到公共客户端
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState<'idle' | 'simulating' | 'signing' | 'mining' | 'success' | 'error'>('idle');

    const deposit = async () => {
        if (!walletClient || !publicClient || !amount) return;
        setStatus('simulating');
        try {
            // 1. 模拟执行，检查是否会失败
            const { request } = await publicClient.simulateContract({ // 模拟执行是在公共客户端里，因为不涉及到签名。
                account: walletClient.account, // 为啥需要传地址：/ ← 这是为了告诉节点"假设"是谁在调用，以便在模拟中执行
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'deposit',
                value: parseEther(amount),
            });
            // 2. 用户签名并发送交易
            setStatus('signing');
            const hash = await walletClient.writeContract(request); // request 就是模拟执行里的对象参数
            // 3. 等待上链
            setStatus('mining');
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            if (receipt.status === 'success') {
                setStatus('success');
                onSuccess();
            } else {
                setStatus('error');
            }
        } catch (error: any) {
            console.error(error);
            // 📝 记录详细错误日志
            console.error('Full error:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Short message:', error.shortMessage);

            // 👤 用户友好的错误提示
            let errorMessage = 'Deposit failed';

            if (error.name === 'UserRejectedRequestError') {
                errorMessage = 'You rejected the transaction';
            } else if (error.message?.includes('insufficient funds')) {
                errorMessage = 'Insufficient ETH balance';
            } else if (error.shortMessage) {
                errorMessage = error.shortMessage;
            }

            // 🔄 更新 UI 状态
            setStatus('error');

            // ⏰ 可选：3秒后清除错误状态
            setTimeout(() => setStatus('idle'), 3000);
            setStatus('error');
        }
    };
    }

    return (
        <div className="mt-4">
            <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount in ETH"
                className="border p-1"
            />
            <button
                onClick={deposit}
                disabled={status === 'simulating' || status === 'signing' || status === 'mining'}
                className="ml-2 bg-purple-500 text-white px-3 py-1 rounded"
            >
                {status === 'idle' && 'Viem Deposit'}
                {status === 'simulating' && 'Simulating...'}
                {status === 'signing' && 'Confirm in wallet...'}
                {status === 'mining' && 'Mining...'}
            </button>
            {status === 'success' && <p className="text-green-600">Deposit successful!</p>}
            {status === 'error' && <p className="text-red-600">Deposit failed</p>}
        </div>
    );
}