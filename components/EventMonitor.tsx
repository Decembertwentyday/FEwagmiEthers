'use client';
import { useWatchContractEvent, useAccount, useQueryClient } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { useState } from 'react';
import { parseAbiItem } from 'viem';

// 用于展示最近交易
interface Log {
    type: string;
    from?: string;
    to?: string;
    amount: string;
}

export default function EventMonitor() {
    const { address } = useAccount();
    const queryClient = useQueryClient();
    const [logs, setLogs] = useState<Log[]>([]);

    // 监听 Deposited 事件
    useWatchContractEvent({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        eventName: 'Deposited',
        onLogs(logs) {
            // 每条日志都代表一次存款
            for (const log of logs) {
                const { sender, amount } = log.args as { sender: string; amount: bigint };
                setLogs(prev => [...prev, { type: 'Deposit', from: sender, amount: amount.toString() }]);
                // 如果存款人是自己，立刻刷新余额
                if (sender.toLowerCase() === address?.toLowerCase()) {
                    // 触发 wagmi 重新获取余额（需有相同的查询 key）
                    queryClient.invalidateQueries({ queryKey: ['readContract'] });
                }
            }
        },
    });

    // 监听 Transferred 事件
    useWatchContractEvent({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        eventName: 'Transferred',
        onLogs(logs) {
            for (const log of logs) {
                const { from, to, amount } = log.args as { from: string; to: string; amount: bigint };
                setLogs(prev => [...prev, { type: 'Transfer', from, to, amount: amount.toString() }]);
                // 涉及自己时刷新余额
                if (from.toLowerCase() === address?.toLowerCase() || to.toLowerCase() === address?.toLowerCase()) {
                    queryClient.invalidateQueries({ queryKey: ['readContract'] });
                }
            }
        },
    });

    return (
        <div className="mt-6">
            <h3 className="font-bold">Recent Activity</h3>
            <ul className="list-disc list-inside max-h-40 overflow-y-auto">
                {logs.slice(-5).reverse().map((l, i) => (
                    <li key={i}>
                        {l.type === 'Deposit' ? (
                            `Deposit from ${l.from?.slice(0,6)}... for ${l.amount} wei`
                        ) : (
                            `Transfer from ${l.from?.slice(0,6)}... to ${l.to?.slice(0,6)}... for ${l.amount} wei`
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}