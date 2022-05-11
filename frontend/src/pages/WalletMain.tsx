import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BlockInfo, Transaction } from "../interfaces";
import { Table, Card } from "react-bootstrap";
import styled from "styled-components";
import TopNav from "../components/TopNav";
import web3 from "../contracts/index";
import ReactLoading from "react-loading";
import PageWrapper from "./page.styled";

function WalletMain() {
  useEffect(() => {}, []);

  return (
    <PageWrapper>
      <WalletMainWrapper>
          
      </WalletMainWrapper>
    </PageWrapper>
  );
}

const WalletMainWrapper = styled.div``;

export default WalletMain;
