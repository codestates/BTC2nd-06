const fs = require("fs-extra");
const path = require("path");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);
const inboxPath = path.resolve(__dirname, "contracts", "SimpleToken.sol");
const source = fs.readFileSync(inboxPath, "utf-8");

const input = {
  language: "Solidity",
  sources: {
    "SimpleToken.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

fs.ensureDirSync(buildPath);
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "SimpleToken.sol"
].SimpleToken;

fs.outputJsonSync(path.resolve(buildPath, "SimpleToken.json"), output);
