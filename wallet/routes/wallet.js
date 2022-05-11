const express = require("express");
const router = express.Router();
const lightwallet = require("eth-lightwallet");
const fs = require("fs");
const getWeb3 = require("../middleware/getWeb3");
const { v1: uuidv1 } = require("uuid");

router.post("/wallet", async (req, res) => {
  try {
    password = req.body.password;
    mnemonic = lightwallet.keystore.generateRandomSeed();
    require("../bsc/web3")(mnemonic);
    const mnemonicId = uuidv1();
    fs.writeFileSync(`mnemonic/${mnemonicId}.txt`, mnemonic);
    // Call API to create Account to dB
    res.status(200).json({ password, mnemonicId });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
});
router.get("/wallet/address/balance", getWeb3, async (req, res) => {
  try {
    const { address } = req.query;
    const web3 = req.web3;
    const balance = await web3.eth.getBalance(address);
    res.status(200).json({ balance });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
});
router.get("/wallet/addresses", getWeb3, async (req, res) => {
  try {
    const web3 = req.web3;
    const accounts = await web3.eth.getAccounts();
    res.status(200).json({ accounts });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
});
router.post("/wallet/address", (req, res) => {});

module.exports = router;
