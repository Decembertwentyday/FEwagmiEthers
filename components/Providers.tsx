'use client';
//
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { createConfig } from '@/lib/config';

const queryClient = new QueryClient();
const config = createConfig();

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={ config }>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
