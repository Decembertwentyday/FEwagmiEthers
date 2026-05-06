import { BrowserProvider, Contract } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contract';
//
export async function getEthersContract() {
  // window.ethereum：这是 MetaMask 等钱包注入到浏览器的对象
  // 作用：检测用户是否安装了加密钱包（如 MetaMask）
  // 如果没有安装：抛出错误，阻止后续操作
  if (!window.ethereum) throw new Error('No crypto wallet found');
  const provider = new BrowserProvider(window.ethereum); // BrowserProvider 与钱包连接的提供者。这个获取的值 值可以读取数据
  const signer = await provider.getSigner(); // 注意：这个是异步的，但在 Hook 里不能直接 await 获取签名，用于交易使用
  // 如果在hook是获取签名
  // useEffect(() => {
  //   const init = async () => {
  //     const signer = await provider.getSigner();
  //   };
  //   init();
  // }, []);
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer); // 创建合约实例
}
// 上述代码作用：
//   1. 检测用户是否安装了加密钱包（如 MetaMask）
//   2. 创建一个与当前浏览器的Ethereum钱包进行交互的提供者
//   3. 获取签名
//   4. 创建合约实例


// 关系对比:provider: 银行的查询终端：查询余额
// signer: 你的银行卡加密码 可以进行交易
// contract: 银行柜员：帮你执行交易
