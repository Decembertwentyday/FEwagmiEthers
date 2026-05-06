'use client';
import { useState } from 'react';
import { getEthersContract } from '@/lib/ethers';
import { parseEther } from 'ethers';

export default function EthersTransfer({ onSuccess }: { onSuccess: () => void }) {
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const [txStatus, setTxStatus] = useState<'idle' | 'signing' | 'mining' | 'success' | 'error'>('idle');

    const transfer = async () => {
        setTxStatus('signing');
        try {
            const contract = await getEthersContract();
            // 合约饿参数是wei  需要parseEther 将ETH转为wei  就是1eth = 100000000000~wei 18次方
            const tx = await contract.transfer(to, parseEther(amount));
            // 发起交易，弹出MetaMask确认窗口，用户点击确认交易，交易会被广播到网络 返回交易对象
            // tx是交易的响应对象
            // tx 包含的信息：
            console.log(tx.hash);        // 交易哈希: "0x123abc..."
            console.log(tx.from);        // 发送者地址
            console.log(tx.to);          // 接收者地址（合约地址）
            console.log(tx.nonce);       // 随机数
            console.log(tx.gasLimit);    // Gas 限制
            console.log(tx.gasPrice);    // Gas 价格
            setTxStatus('mining');
            await tx.wait(); // 等待矿工确认 确认后 才会往下执行
            setTxStatus('success');
            onSuccess();
        } catch (e) {
            console.error(e);
            setTxStatus('error');
        }
    };

    const Tranfer = async () => {
        try {
            // 获取合约实例
            const contract = await getEthersContract();
            // 进行转账使用的transfer方法 拿到交易对象 参数要的是wei
            // 发起弹窗 进行确认操作
            const tx = await contract.transfer(to, parseEther(amount));
            console.log(tx);
            await tx.wait(); // 等待矿工确认后 才会执行后面代码
            // 没有上面这一步：
            // 1。 交易可能会丢失
            // 2. 交易可能因为GAS 不足 失败
            // 3. 用户看到成功，实际未到账
            onSuccess();
        } catch (e) {
            console.error(e);
        }
    }


    return (
        <div>
            {/* inputs similar to wagmi version */}
            <input
              placeholder='转账地址'
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            <input
                placeholder='转账金额'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={transfer} disabled={txStatus === 'signing' || txStatus === 'mining'}>
                {txStatus === 'signing' ? 'Confirm in wallet...' : txStatus === 'mining' ? 'Mining...' : 'Transfer'}
            </button>
            {txStatus === 'success' && <p className="text-green-600">Transfer successful!</p>}
            {txStatus === 'error' && <p className="text-red-600">Transfer failed</p>}
        </div>
    );
}
