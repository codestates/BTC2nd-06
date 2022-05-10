import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ExplorerHome from "./pages/ExplorerHome";
import ExplorerDetail from "./pages/ExplorerDetail";

function App() {
  const [latestTxList, setlastestTxList] = useState([]);
  const [latestBlockList, setLatestBlockList] = useState([]);

  useEffect(() => {}, []);

  async function initExplorer() {}
  async function fetchLatestTx() {}

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ExplorerHome />}></Route>
        <Route path="explorer/:txn" element={<ExplorerDetail />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
