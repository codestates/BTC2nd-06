const express = require("express");
const router = express.Router();
const getWeb3 = require("../middleware/getWeb3");

router.post("/transaction", getWeb3, async (req, res) => {
  const { fromAddr, toAddr, valueBNB, gasPrice, gas } = req.body;
  const web3 = req.web3;
  const value = parseFloat(valueBNB) * 1.0e18;
  try {
    const result = await web3.eth.sendTransaction(
      {
        from: fromAddr,
        to: toAddr,
        value: value,
        gasPrice: gasPrice,
        gas: gas,
      },
      function (err, txhash) {
        console.log("error: " + err);
        console.log("txhash: " + txhash);
      }
    );
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
});
router.get("/transaction/gas", getWeb3, async (req, res) => {
  const { toAddr, fromAddr, valueBNB } = req.query;
  const web3 = req.web3;
  try {
    const gas = await web3.eth.estimateGas({
      to: toAddr,
      from: fromAddr,
      value: valueBNB * 1.0e18,
    });
    res.status(200).json({ gas });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
});
router.get("/transaction/gasprice", getWeb3, async (req, res) => {
  const web3 = req.web3;
  try {
    const gasPrice = await web3.eth.getGasPrice();
    res.status(200).json({ gasPrice });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
});
module.exports = router;
