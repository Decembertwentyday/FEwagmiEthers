export const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // 替换为你部署的地址

export const CONTRACT_ABI = [
  "function getBalance(address user) external view returns (uint256)",
  "function deposit() external payable",
  "function transfer(address to, uint256 amount) external",
  "event Deposited(address indexed sender, uint256 amount)",
  "event Transferred(address indexed from, address indexed to, uint256 amount)"
] as const;  // 使用 const 断言可以给 TypeScript 更好的类型推断