const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const rpcURL = "https://data-seed-prebsc-1-s1.binance.org:8545/"; // 원격 이더리움 노드에 접속할 수 있는 주소

module.exports = (mnemonic) => {
  const provider = new HDWalletProvider(
    mnemonic,
    // remember to change this to your own phrase!
    rpcURL
    // remember to change this to your own endpoint!
  );
  return new Web3(provider);
};

// const HookedWeb3Provider = require("hooked-web3-provider");
// const Web3 = require("web3");
// const web3 = new Web3();
// const setWeb3Provider = (keystore) => {
//   const web3Provider = new HookedWeb3Provider({
//     host: "https://data-seed-prebsc-1-s1.binance.org:8545/",
//     transaction_signer: keystore,
//   });

//   web3.setProvider(web3Provider);
// };
// module.exports = (key) => {
//   setWeb3Provider(key);

//   return web3;
// };
