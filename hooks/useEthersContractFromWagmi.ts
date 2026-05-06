import { useEthersSigner } from '@/hooks/useEthersSigner';
import { Contract } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { useMemo } from 'react';
//
export function useEthersContractFromWagmi() {
  const signer = useEthersSigner();
  return useMemo(() => {
    if (!signer) return null;
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }, [signer]);
}
