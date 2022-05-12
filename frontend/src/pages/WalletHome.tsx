import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BlockInfo, Transaction } from "../interfaces";
import { Form, Button } from "react-bootstrap";
import styled from "styled-components";
import TopNav from "../components/TopNav";
import web3 from "../contracts/index";
import { toast } from "react-toastify";
import { getMasterWalletInfo } from "../common/api";

import PageWrapper from "./page.styled";
import theme from "../theme";

function WalletHome() {
  const [balance, setBalance] = useState();
  const [targetAddress, setTargetAddress] = useState();
  useEffect(() => {
    (async () => {
      await getWalletInfo();
    })();
  }, []);

  async function getWalletInfo() {
    try {
      const { data } = await getMasterWalletInfo();
      if (data) {
        console.log("!!!!!!", data);
      }
    } catch (error) {
      console.log(error);
      toast.warn(`회원가입 중 문제가 발생하였습니다. \n ${error}`);
    }
  }

  async function signup() {}
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
