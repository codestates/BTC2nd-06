import { useEffect, useState } from "react";
import { Form, Button, Table } from "react-bootstrap";
import styled from "styled-components";
import TopNav from "../components/TopNav";
import { toast } from "react-toastify";
import { getMasterWalletInfo, getBalance, getTTSBalance } from "../common/api";
import ReactLoading from "react-loading";
import PageWrapper from "./page.styled";
import { useFetch } from "../common/fetchHook";
import web3 from "../contracts";

const bnblogo = require("../common/assets/bnb-logo.png");

function WalletHome() {
  const [balance, setBalance] = useState(0);
  const [TTSbalance, setTTSbalance] = useState(0);
  const [targetAddress, setTargetAddress] = useState(0);
  const [addresslist, setAddresslist] = useState([]);
  const [, fetchWallet, isLoading] = useFetch(getMasterWalletInfo);
  const [, fetchBalance, isBalanceLoading] = useFetch(getBalance);

  useEffect(() => {
    (async () => {
      const initAddress = await getWalletInfo();
      await getWalletBalance(initAddress);
    })();
  }, []);

  useEffect(() => {}, []);

  async function getWalletInfo() {
    try {
      const { data } = await fetchWallet();
      if (data) {
        setAddresslist(data.address_list);
      }
      return data.address_list[0];
    } catch (error) {
      console.log(error);
      toast.warn(`회원가입 중 문제가 발생하였습니다. \n ${error}`);
    }
  }
  async function getWalletBalance(address: string) {
    try {
      const { data } = await fetchBalance({
        address,
      });
      const { data: TTSbalance } = await getTTSBalance({ address });
      if (data && TTSbalance) {
        const balance = await web3.utils.fromWei(data.balance, "ether");
        const TTSbal = await web3.utils.fromWei(TTSbalance.balance, "ether");
        setBalance(balance);
        setTTSbalance(TTSbal);
      }
    } catch (error) {
      console.log(error);
      toast.warn(`회원가입 중 문제가 발생하였습니다. \n ${error}`);
    }
  }

  return (
    <PageWrapper>
      <TopNav />
      <WalletHomeWrapper>
        <div className="top-wrapper">
          Others Wallets
          <Form.Select
            aria-label="Default select example"
            className="mt-2"
            onChange={(e) => {
              const n = e.target.value;
              setTargetAddress(Number(n));
              getWalletBalance(addresslist[Number(n)]);
            }}
            value={targetAddress}
          >
            {addresslist.map((e, idx) => (
              <option key={`wallet-address-${idx}`} value={idx}>
                {e}
              </option>
            ))}
          </Form.Select>
          <img className="logo mt-10" src={bnblogo} alt="bnb" />
          {!isLoading && !isBalanceLoading && (
            <div className="balance">{balance} BnB</div>
          )}
        </div>
        <div className="button-form">
          <Button className="button" variant="warning">
            전송
          </Button>
          <Button className="button" variant="warning">
            수신
          </Button>
          <Button className="button" variant="warning">
            기록
          </Button>
        </div>
        <span className="tokens-title">Other Tokens</span>
        <div className="other-tokens">
          <Table className="mb-0" bordered variant="dark" size="lg">
            <tbody>
              <TableRow key={`detail-token`}>
                <TableData className="header">TTS </TableData>

                <TableData className="header right">{TTSbalance}TTS </TableData>
                <TableData>
                  <div className="buttons">
                    <Button variant="warning">전송</Button>
                    <Button variant="warning">기록</Button>
                  </div>
                </TableData>
              </TableRow>
            </tbody>
          </Table>
        </div>
        {(isLoading || isBalanceLoading) && (
          <ReactLoading className="loading" type="spin" />
        )}
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
  .top-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .logo {
      display: inline-block;
      width: 8rem;
      height: 8rem;
      margin: 2rem 0;
      font-weight: 700;
    }
    .balance {
      font-size: 2.2rem;
    }
  }

  .button-form {
    width: 50%;
    height: 30px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 2rem;
  }
  .tokens-title {
    font-size: 1.2rem;
    float: right;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  .other-tokens {
    width: 100%;
    height: 250px;
    border: 1px solid white;
    border-radius: 0.5rem;
    .token {
      width: 100%;
      height: 4rem;
      margin: 0.2rem;
      border-bottom: 1px solid lightgray;
    }
  }
  .button {
    font-weight: 700;
    font-size: 1.6rem;
  }

  .loading {
    position: fixed;
    top: 30rem;
    left: 18rem;
  }
`;
const TableRow = styled.tr`
  height: auto;
  border: 0.3rem solid #6c757d99;
  border-radius: 0.5rem;
  word-break: break-all;
  font-size: 15px;
  .header {
    font-weight: 700;
  }
`;
const TableData = styled.td`
  vertical-align: middle;
  max-width: 20rem;
  height: 4rem;
  text-align: center;
  flex-direction: column;
  padding: 1rem;
  width: 150px;
  .flex {
    width: 100px;
  }
  .buttons {
    justify-content: space-around;
    align-items: center;
    display: flex;
  }
`;

export default WalletHome;
