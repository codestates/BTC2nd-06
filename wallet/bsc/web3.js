const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const rpcURL = "https://data-seed-prebsc-1-s1.binance.org:8545/"; // 원격 이더리움 노드에 접속할 수 있는 주소

module.exports = (mnemonic) => {
  const provider = new HDWalletProvider(mnemonic, rpcURL);
  provider.engine.stop();
  return new Web3(provider);
};
