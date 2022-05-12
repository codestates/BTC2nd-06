const express = require("express");
const router = express.Router();
const lightwallet = require("eth-lightwallet");
const fs = require("fs");
const getWeb3 = require("../middleware/getWeb3");
const { v1: uuidv1 } = require("uuid");
const axios = require("axios");

router.post("/wallet", async (req, res) => {
  try {
    const { password, username } = req.body;
    const mnemonic = lightwallet.keystore.generateRandomSeed();
    const web3 = require("../bsc/web3")(mnemonic);
    const accounts = await web3.eth.getAccounts();
    const mnemonicId = uuidv1();

    fs.writeFileSync(`mnemonic/${mnemonicId}.txt`, mnemonic);
    // Call API to create Account to dB
    const result = await axios.post(
      "http://ec2-15-164-229-111.ap-northeast-2.compute.amazonaws.com/wallet/",
      {
        username,
        password,
        mnemonic_seed: mnemonic,
        address_list: accounts,
      }
    );
    console.log("SUCCESS");
    console.log(result.data);

    res.status(200).json({ password, mnemonicId, mnemonic, accounts });
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
