const express = require("express");
const router = express.Router();
const getWeb3 = require("../middleware/getWeb3");
const simpletoken = require("../bsc/simpletoken");
const { evm } = require("../bsc/build/SimpleToken.json");

// router.post("/contract", getWeb3, async (req, res) => {
//   try {
//     let contract;
//     const { contractAccount } = req.body;
//     const web3 = req.web3;
//     const contractInstance = simpletoken(web3, contractAccount);
//     contract = await contractInstance.deploy({
//       data: evm.bytecode.object,
//       arguments: ["SimpleToken", "STT"],
//     });
//     const gas = await contract.estimateGas();
//     const gasPrice = await web3.eth.getGasPrice();
//     contract = await contract.send({ gas, gasPrice, from: contractAccount });
//     res.status(200).send("Contract created");
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ error: error.message });
//   }
// });
router.post("/contract/balanceOf", getWeb3, async (req, res) => {
  try {
    const { tokenAccount } = req.body;
    const web3 = req.web3;
    const contractInstance = simpletoken(web3);
    const balance = await contractInstance.methods
      .balanceOf(tokenAccount)
      .call();
    res.status(200).json({ balance });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
});

router.post("/contract/transfer", getWeb3, async (req, res) => {
  try {
    const { fromAddr, toAddr, value, gas, gasPrice } = req.body;
    const web3 = req.web3;
    const contractInstance = simpletoken(web3);
    await contractInstance.methods
      .transfer(toAddr, value)
      .send({ gas, gasPrice, from: fromAddr });
    console.log(`Transfered ${value} token from ${fromAddr} to ${toAddr}`);
    res.status(200).json({
      message: `Transfered ${value} token from ${fromAddr} to ${toAddr}`,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
});
module.exports = router;
