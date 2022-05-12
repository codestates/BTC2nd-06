import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import styled from "styled-components";
import TopNav from "../components/TopNav";
import { toast } from "react-toastify";
import { getMasterWalletInfo, getBalance } from "../common/api";
import ReactLoading from "react-loading";
import PageWrapper from "./page.styled";
import { useFetch } from "../common/fetchHook";
const bnblogo = require("../common/assets/bnb-logo.png");

function WalletHome() {
  const [balance, setBalance] = useState();
  const [targetAddress, setTargetAddress] = useState("");
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
      if (data) {
        setBalance(data.balance);
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
        {!isLoading && !isBalanceLoading ? (
          <div className="top-wrapper">
            내 지갑들
            <Form.Select
              aria-label="Default select example"
              onChange={(e) => {
                const n = e.target.value;
                setTargetAddress(addresslist[Number(n)]);
                getWalletBalance(targetAddress);
              }}
            >
              {addresslist.map((e, idx) => (
                <option key={`wallet-address-${idx}`} value={idx}>
                  {e}
                </option>
              ))}
            </Form.Select>
            <img className="logo mt-10" src={bnblogo} alt="bnb" />
            <div className="balance">{balance} BnB</div>
          </div>
        ) : (
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
      width: 10rem;
      height: 10rem;
      margin-top: 2rem;
    }
    .balance {
      font-size: 2.2rem;
    }
  }

  .loading {
    position: fixed;
    top: calc(40% - 32px);
    left: calc(50% - 32px);
  }
`;

export default WalletHome;
