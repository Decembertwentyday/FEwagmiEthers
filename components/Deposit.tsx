'use client';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { parseEther } from 'viem';
import { useState, useEffect } from 'react';

export default function Deposit({ onSuccess }: { onSuccess: () => void }) {
    const [amount, setAmount] = useState(''); // react 原生hook 更新状态
    useEffect(() => {
        if (isSuccess) onSuccess();
    }, [isSuccess, onSuccess]);
    const { data: hash, writeContract, isPending } = useWriteContract(); // 写入合约数据 花费Gas
    // isPending: 钱包正在等待用户确认, 确认后会得到hash值。
    // 这是修改区块链状态的Hook，会弹出MetaMask确认窗口。
    const deposit = () => {
        if (!amount) return;
        writeContract({ // 交易参数
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'deposit',
            value: parseEther(amount), // 发送的 ETH 数量
        });
    };
    // 详细流程：deposit() -> writeContract() -> hash -> useWaitForTransactionReceipt()
    // 1. 等待用户调用writeContract 写入的函数，参数是交易参数
    // 2. wagmi 通过viem的walletClient 构造交易数据
    // 3. 调用钱包的eth_sendTransaction()方法，弹出MetaMask确认窗口
    // 4. 用户在 MetaMask 点击 确认交易，交易会被广播到网络 返回交易hash。
    // 5. 交易处于pending状态，使用 useWaitForTransactionReceipt({hash}) 监听并获取交易结果

    // useWaitForTransactionReceipt：
    //    监听交易是否被打包进区块，获取交易结果。会返回值：
    //        isLoading: isConfirming, // 交易状态：正在处理中、处理完成、处理失败
    //        isSuccess: isSuccess, // 交易是否成功
    // isError：错误信息，如果交易失败，会返回错误信息。

     // 如果写入的操作执行失败，会浪费Gas 所以就有了 useSimulateContract : 模拟写入/转账操作
    // 等待交易被矿工打包
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ // 等待交易被矿工打包
        hash,
    });
    return (
        <div>
            <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount in ETH"
                className="border p-1"
            />
            <button
                onClick={deposit}
                disabled={isPending || isConfirming}
                className="ml-2 bg-green-500 text-white px-3 py-1 rounded"
            >
                {isPending ? 'Confirm in wallet...' : isConfirming ? 'Depositing...' : 'Deposit'}
            </button>
            {isSuccess && <p className="text-green-600">Deposit successful!</p>}
        </div>
    );
}
