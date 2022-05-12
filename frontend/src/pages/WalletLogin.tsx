import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BlockInfo, Transaction } from "../interfaces";
import { Form, Button } from "react-bootstrap";
import styled from "styled-components";
import TopNav from "../components/TopNav";
import PageWrapper from "./page.styled";
import { loginWallet } from "../common/api";
import theme from "../theme";

function WalletLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    login();
  }, []);

  async function login() {
    const data = await loginWallet();
    console.log(data);
  }

  return (
    <PageWrapper>
      <TopNav />
      <WalletMainWrapper>
        <div className="title-box">
          <div className="sub-title">Wallet</div>
          <div className="wallet-title">Genesis</div>
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
              className="form center"
              type="password"
              name="password"
              placeholder="enter your password"
            />
            <Button className="form" variant="warning">
              Login
            </Button>
          </Form.Group>
        </div>
        <div className="first">
          <span>처음이신가요?</span>
          <div className="creat-wallet">지갑 생성하기</div>
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
  .title-box {
    display: flex;
    justify-content: center;
    align-content: center;
    margin-bottom: 2rem;
    flex-direction: column;
  }
  .wallet-title {
    font-size: 4rem;
    font-weight: 700;
    color: ${theme.colors.Yellow};
    text-align: center;
  }
  .sub-title {
    margin-top: 1rem;
    font-size: 1.5rem;
    margin-left: 200px;
  }
  .form {
    margin: 0.5rem;
    display: inline-block;
    width: 80%;
  }
  .form-group {
    margin-top: 2rem;
    text-align: center;
  }
  .first {
    margin-top: 4rem;
    text-align: center;
    font-size: 1.2rem;
    .creat-wallet {
      margin-top: 1.4rem;
      font-size: 1.4rem;
      display: block;
    }
  }
`;

export default WalletLogin;
