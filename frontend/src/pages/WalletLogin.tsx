import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import styled from "styled-components";
import TopNav from "../components/TopNav";
import PageWrapper from "./page.styled";
import { toast } from "react-toastify";
import { setWalletLogin, getGasInfo, getBalance } from "../common/api";
import ReactLoading from "react-loading";
import { useFetch } from "../common/fetchHook";
import theme from "../theme";

function WalletLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [, fetchSignin, isLoading] = useFetch(setWalletLogin);
  const navigate = useNavigate();

  function goSingupPage() {
    navigate(`/wallet/signup`);
  }
  function goWalletPage() {
    navigate(`/wallet/my`);
  }

  useEffect(() => {}, []);
  const notify = async () => {
    console.log(await getBalance());
    console.log(await getGasInfo());
    //
  };

  async function signup() {
    try {
      const { data } = await fetchSignin({ username: id, password });
      if (data) {
        goWalletPage();
        return;
      }
      throw new Error();
    } catch (error) {
      console.log(error);
      toast.warn(`회원가입 중 문제가 발생하였습니다. \n ${error}`);
    }
  }

  async function login() {
    // const data = await createWallet();
    // console.log(data);
  }

  return (
    <PageWrapper>
      <TopNav />
      <WalletMainWrapper>
        <div className="title-box">
          <div className="sub-title" onClick={login}>
            Wallet
          </div>
          <div className="wallet-title" onClick={notify}>
            Genesis
          </div>
        </div>
        <div>
          <Form.Group className="form-group">
            <Form.Control
              className="form"
              type="text"
              name="id"
              onChange={(e) => {
                setId(e.target.value);
              }}
              placeholder="enter your id"
            />
            <Form.Control
              className="form center"
              type="password"
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="enter your password"
            />
            <Button className="form" variant="warning" onClick={signup}>
              Login
            </Button>
          </Form.Group>
        </div>
        <div className="first">
          <span>처음이신가요?</span>
          <div className="creat-wallet" onClick={goSingupPage}>
            지갑 생성하기
          </div>
        </div>
        {isLoading && <ReactLoading className="loading" type="spin" />}
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
