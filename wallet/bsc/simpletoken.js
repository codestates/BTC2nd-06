const { abi } = require("./build/SimpleToken.json");

const contract = (web3) => {
  return new web3.eth.Contract(
    abi,
    "0x7D52F1BC98d13f4DA45F58bE52a44BA9d6630737"
  );
};
module.exports = contract;
