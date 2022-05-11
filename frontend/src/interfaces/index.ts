export interface Transaction {
  blockHash: string;
  txHash: string;
  blockNumber: number;
  from: string;
  gas: string;
  gasPrice: string;
  hash: string;
  input: string;
  nonce: number;
  r: string;
  s: string;
  to: string;
  transactionIndex: number;
  type: string;
  v: string;
  value: string;
}

export interface BlockInfo {
  blockHeight: number;
  difficulty: string;
  extraData: string;
  gasLimit: number;
  gasUsed: number;
  hash: string;
  logsBloom: string;
  miner: string;
  mixHash: string;
  nonce: string;
  number: number;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  size: number;
  stateRoot: string;
  timestamp: number;
  totalDifficulty: string;
  transactions: string[];
  transactionsRoot: string;
}
