import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BlockInfo, Transaction } from "../interfaces";
import { Form, Button } from "react-bootstrap";
import styled from "styled-components";
import TopNav from "../components/TopNav";
import web3 from "../contracts/index";
import ReactLoading from "react-loading";
import PageWrapper from "./page.styled";
import theme from "../theme";

function WalletHome() {
  const [balance, setBalance] = useState();
  const [targetAddress, setTargetAddress] = useState();
  useEffect(() => {}, []);

  function getWalletInfo() {}
  return (
    <PageWrapper>
      <TopNav />
      <WalletHomeWrapper>
        <div>
          <Form.Select aria-label="Default select example">
            <option>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Form.Select>
          <div className="logo"></div>
          <div className="balance"> BnB</div>
        </div>
      </WalletHomeWrapper>
    </PageWrapper>
  );
}

const WalletHomeWrapper = styled.div`
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .logo {
    display: inline-block;
    width: 10rem;
    height: 10rem;
    background-color: gray;
  }
  .balance {
    font-size: 2.2rem;
  }
`;

export default WalletHome;
