import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import web3 from "./contracts/index";
import ExplorerHome from "./pages/ExplorerHome";
import ExplorerDetail from "./pages/ExplorerDetail";
import { BlockInfo, Transaction } from "./interfaces";

function App() {
  const [latestBlock, setlatestBlock] = useState<BlockInfo[]>([]);
  const [latestTxList, setlatestTxList] = useState<Transaction[]>([]);

  useEffect(() => {
    initExplorer();
  }, []);

  async function initExplorer() {
    const lastBlockNum = await web3.eth.getBlockNumber();
    fetchLatestBlock(lastBlockNum);
    fetchLatestTx(lastBlockNum);

    setInterval(() => {
      fetchLatestBlock(lastBlockNum);
      fetchLatestTx(lastBlockNum);
    }, 15000);
  }
  async function fetchLatestTx(lastBlockNum: number) {
    const LasBlockInfo = await web3.eth.getBlock(lastBlockNum, false);
    const { transactions } = LasBlockInfo;
    const latestTxList: Transaction[] = await Promise.all(
      transactions.map(async (t: string) => {
        const txList = await web3.eth.getBigGasLimitTransaction(t);
        return {
          ...txList,
          value: web3.utils.fromWei(txList.value, "ether"),
          txHash: t,
        };
      })
    );

    setlatestTxList([...latestTxList].splice(0, 7));
  }

  async function fetchLatestBlock(lastBlockNum: number) {
    const blockList = [];
    for (let i = lastBlockNum - 6; i <= lastBlockNum; i++) {
      const block = await web3.eth.getBlock(i, false);
      blockList.push({ ...block, blockHeight: i });
    }
    setlatestBlock(
      [...blockList].sort((a, b) => b.blockHeight - a.blockHeight)
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ExplorerHome
              latestTxList={latestTxList}
              latestBlock={latestBlock}
            />
          }
        ></Route>
        <Route path="/explorer" element={<ExplorerDetail />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
