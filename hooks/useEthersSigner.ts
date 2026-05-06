import { useWalletClient } from 'wagmi';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
// BrowserProvider： 创建一个与当前浏览器的Ethereum钱包进行交互的提供者
// JsonRpcSigner： 一个用于与Ethereum钱包进行交互的类 的签名者类
import { useMemo } from 'react';
// 参数是 WalletClient：客户端的对象种转为ethers的签名者对象
export function walletClientToSigner(walletClient: any): JsonRpcSigner | null {
  if (!walletClient) return null;
  // 解构 walletClient里的属性
  const { account, chain, transport } = walletClient;
  // 重新构建ethers的签名对象参数
  // 因为wagmi 和 ethers的 网络信息格式不一致，所以需要重新构建
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  // transport：RPC 传输层
  const provider = new BrowserProvider(transport, network);
  // account.address: 用户的钱包地址（如 "0x123..."）
  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}
// 怎么在wagmi 里使用ethers
//  1. 获取钱包客户端对象
//       将其参数解构，转为ethers的签名者对象
//           创建提供者，把客户端的Rpc 还有 ethers的网络信息当作参数
//                  通过 JsonRpcSigner 创建签名者对象

//  2. 将钱包客户端对象 转换成ethers的签名者对象
//  3. 使用ethers的签名者对象进行转账 写入操作 读取数据
//  4. 返回签名者对象
//  5. 在组件中使用签名者对象进行转账 写入操作 读取数据
//  6. 渲染组件
//  7. 监听钱包客户端对象变化
//  8. 如果钱包客户端对象变化，则重新转换成ethers的签名者对象
//  9. 返回新的签名者对象
//  10. 在组件中使用新的签名者对象进行转账 写入操作 读取数据


export function useEthersSigner() {
  const { data: walletClient } = useWalletClient(); // 钱包客户端进行 转账 写入操作 也可读取
  return useMemo(() => walletClientToSigner(walletClient), [walletClient]);
  // walletClientToSigner 函数：将walletClient 转换成 ethers的签名者对象
}

