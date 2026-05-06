'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import WagmiBalance from '@/components/WagmiBalance';
import Deposit from '@/components/Deposit';
import Transfer from '@/components/Transfer';
import { useState } from 'react'
export default function Home() {
  // 用 refreshKey 变化来触发子组件重新获取数据
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshBalance = () => setRefreshKey(k => k + 1);
  return (
    <main className="p-8">
      <ConnectButton />
        <WagmiBalance key={refreshKey} />
        <Deposit onSuccsee={refreshBalance}/>
        <Transfer onSuccess={refreshBalance} />
    </main>
  );
}
