const { abi, evm } = require("./build/SimpleToken.json");
const fs = require("fs");
const mnemonic = fs.readFileSync(
  `../mnemonic/7acf53f0-d058-11ec-b516-57f1c9207640.txt`
);
const web3 = require("../bsc/web3")(mnemonic.toString());
const deploy = async () => {
  try {
    let contract;
    const accounts = await web3.eth.getAccounts();
    const contractInstance = await new web3.eth.Contract(abi);
    contract = await contractInstance.deploy({
      data: evm.bytecode.object,
      arguments: ["SimpleToken", "STT"],
    });
    const gas = await contract.estimateGas();
    const gasPrice = await web3.eth.getGasPrice();
    contract = await contract.send({ gas, gasPrice, from: accounts[0] });

    console.log(contract.options.address);
  } catch (err) {
    console.log(err);
  }
};

deploy();
