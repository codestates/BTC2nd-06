import Web3 from "web3";
import { AbiItem } from "web3-utils";
import bigGasLimitTransactionFormatter from "../common/helper";
const TESTNET_RPC = "https://data-seed-prebsc-1-s1.binance.org:8545/" as const;
const web3: any = new Web3(TESTNET_RPC);

web3.eth.extend({
  methods: [
    {
      name: "getBigGasLimitTransaction",
      call: "eth_getTransactionByHash",
      params: 1,
      inputFormatter: [null],
      outputFormatter: bigGasLimitTransactionFormatter,
    },
  ],
});

export default web3;
