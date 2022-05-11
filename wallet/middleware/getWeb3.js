const fs = require("fs");

const getWeb3 = (req, res, next) => {
  const mnemonicId =
    req.method === "GET" ? req.query.mnemonicId : req.body.mnemonicId;
  const mnemonic = fs.readFileSync(`mnemonic/${mnemonicId}.txt`);
  const web3 = require("../bsc/web3")(mnemonic.toString());
  req.web3 = web3;
  next();
};
module.exports = getWeb3;
