import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import web3 from "./contracts/index";
import ExplorerHome from "./pages/ExplorerHome";
import ExplorerDetail from "./pages/ExplorerDetail";
import WalletLogin from "./pages/WalletLogin";
import WalletSignup from "./pages/WalletSignup";
import WalletHome from "./pages/WalletHome";
import WalletLogList from "./pages/WalletLogList";
import { BlockInfo, Transaction } from "./interfaces";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      console.log("fetch data");
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
        <Route path="/wallet" element={<WalletLogin />} />
        <Route path="/wallet/signup" element={<WalletSignup />} />
        <Route path="/wallet/my" element={<WalletHome />} />
        <Route path="/wallet/log" element={<WalletLogList />} />
        <Route path="*" element={<WalletLogList />} />
      </Routes>
      <ToastContainer theme={"dark"} autoClose={3000} />;
    </HashRouter>
  );
}

export default App;
