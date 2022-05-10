import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
