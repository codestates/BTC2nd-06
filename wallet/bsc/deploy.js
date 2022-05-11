const { abi, evm } = require("./build/SimpleToken.json");
module.exports = deploy = async (web3) => {
  console.log("Accounts");
  console.log(await web3.eth.getAccounts());
  // const accounts = ["0x28138db466771f78a01a4645e996b18b340a179d"];
  console.log(accounts);
  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: ["SimpleToken", "STT"] })
    .send({ gas: "1000000", from: accounts[0] });
  provider.engine.stop();
};
