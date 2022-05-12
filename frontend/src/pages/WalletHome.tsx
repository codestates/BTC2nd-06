import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import styled from "styled-components";
import TopNav from "../components/TopNav";
import { toast } from "react-toastify";
import { getMasterWalletInfo } from "../common/api";
import ReactLoading from "react-loading";
import PageWrapper from "./page.styled";
import { useFetch } from "../common/fetchHook";

function WalletHome() {
  const [balance, setBalance] = useState();
  const [targetAddress, setTargetAddress] = useState();
  const [addresslist, setAddresslist] = useState([]);
  const [, fetchWallet, isLoading] = useFetch(getMasterWalletInfo);

  useEffect(() => {
    (async () => {
      await getWalletInfo();
    })();
  }, []);

  async function getWalletInfo() {
    try {
      const { data } = await fetchWallet();
      if (data) {
        setAddresslist(data.address_list);
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
        {!isLoading ? (
          <div>
            <Form.Select aria-label="Default select example">
              {addresslist.map((e, idx) => (
                <option key={`wallet-address-${idx}`} value="1">
                  {e}
                </option>
              ))}
            </Form.Select>
            <img
              className="logo"
              src={`${process.env.PUBLIC_URL}/public_assets/bnb-logo.png`}
              alt="bnb"
            />
            <div className="balance"> BnB</div>
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
  .logo {
    display: inline-block;
    width: 10rem;
    height: 10rem;
    background-color: gray;
  }
  .balance {
    font-size: 2.2rem;
  }
  .loading {
    position: fixed;
    top: calc(40% - 32px);
    left: calc(50% - 32px);
  }
`;

export default WalletHome;
