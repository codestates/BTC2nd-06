import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BlockInfo, Transaction } from "../interfaces";
import { Table, Card, Form, Col } from "react-bootstrap";
import styled from "styled-components";
import TopNav from "../components/TopNav";
import web3 from "../contracts/index";
import ReactLoading from "react-loading";
import PageWrapper from "./page.styled";
import theme from "../theme";

function WalletHome() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {}, []);

  return (
    <PageWrapper>
      <TopNav />
      <WalletMainWrapper>
        <div>
          <div className="wallet-title">Genesis</div>
          <div>Wallet</div>
        </div>
        <div>
          <Form.Group controlId="validationFormik101" className="form-group">
            <Form.Control
              className="form"
              type="text"
              name="id"
              placeholder="enter your id"
            />
            <Form.Control
              className="form"
              type="password"
              name="password"
              placeholder="enter your password"
            />
          </Form.Group>
        </div>
      </WalletMainWrapper>
    </PageWrapper>
  );
}

const WalletMainWrapper = styled.div`
  color: white;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  .wallet-title {
    font-size: 3rem;
    font-weight: 700;
    color: ${theme.colors.Yellow};
    margin-top: 1rem;
    text-align: center;
  }
  .form {
    margin: 0.5rem;
    display: inline-block;
    width: 80%;
  }
  .form-group {
    text-align: center;
  }
`;

export default WalletHome;
