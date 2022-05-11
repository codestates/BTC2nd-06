import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BlockInfo, Transaction } from "../interfaces";
import { Table, Card } from "react-bootstrap";
import styled from "styled-components";
import TopNav from "../components/TopNav";
import web3 from "../contracts/index";
import ReactLoading from "react-loading";
import PageWrapper from "./page.styled";
import theme from "../theme";

function WalletHome() {
  useEffect(() => {}, []);

  return (
    <PageWrapper>
      <TopNav />
      <WalletMainWrapper>
        <div className="wallet-title">Genesis</div>
        <div>Wallet</div>
      </WalletMainWrapper>
    </PageWrapper>
  );
}

const WalletMainWrapper = styled.div`
  color: white;
  display: flex;
  justify-content: center;
  align-content: center;
  .wallet-title {
    font-size: 30px;
    font-weight: 700;
    color: ${theme.colors.Yellow};
  }
`;

export default WalletHome;
