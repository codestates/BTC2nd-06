import { ChangeEvent, useEffect, useState } from "react";
import { Form, Button, Table } from "react-bootstrap";
import styled from "styled-components";
import TopNav from "../components/TopNav";
import { toast } from "react-toastify";
import {
  getMasterWalletInfo,
  getBalance,
  getTTSBalance,
  getSlaveWalletInfo,
  getGas,
  getGasPrice,
  sendCoin,
  sendToken,
} from "../common/api";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import PageWrapper from "./page.styled";
import { useFetch } from "../common/fetchHook";
import Modal from "react-modal";
import theme from "../theme";
import web3 from "../contracts";

const bnblogo = require("../common/assets/bnb-logo.png");

function WalletHome() {
  const [balance, setBalance] = useState(0);
  const [TTSbalance, setTTSbalance] = useState(0);
  const [targetAddress, setTargetAddress] = useState(0);
  const [addresslist, setAddresslist] = useState([]);
  const [, fetchWallet, isLoading] = useFetch(getMasterWalletInfo);
  const [, fetchBalance, isBalanceLoading] = useFetch(getBalance);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [transferData, setTransferData] = useState({
    toAddress: "",
    amount: 0,
    gas: 0,
    gasPrice: 0,
  });

  const [token, setToken] = useState("BNB");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const initAddress = await getWalletInfo();
      await getWalletBalance(initAddress);
    })();
  }, []);

  function goLogPage() {
    navigate(`/wallet/log?addr=${addresslist[targetAddress]}`);
  }
  function onChangeTransferForm(e: ChangeEvent, type: string) {
    const target = e.target as HTMLInputElement;
    setTransferData({
      ...transferData,
      [type]: target.value,
    });
    console.log(transferData);
  }

  function openTransferModal(token: string) {
    setToken(token);
    setIsOpen(true);
  }
  async function closeTransferModal() {
    setIsOpen(false);
    await getWalletBalance(addresslist[targetAddress]);
  }

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
        const TTSbal = TTSbalance.balance;
        setBalance(balance);
        setTTSbalance(TTSbal);
      }
    } catch (error) {
      console.log(error);
      toast.warn(`회원가입 중 문제가 발생하였습니다. \n ${error}`);
    }
  }

  async function getGasPriceInfo() {
    try {
      const { data } = await getGasPrice();
      setTransferData({ ...transferData, gasPrice: data.gasPrice });
    } catch (error) {
      console.log(error);
      toast.warn(`가스를 불러오는 도중 문제가 발생하였습니다. \n ${error}`);
    }
  }

  async function getGasinfo(address: string) {
    try {
      const { data } = await getGas({
        toAddr: address,
        fromAddr: addresslist[targetAddress],
        valueBNB: transferData.amount,
      });

      setTransferData({ ...transferData, toAddress: address, gas: data.gas });
    } catch (error) {
      console.log(error);
      toast.warn(`가스를 불러오는 도중 문제가 발생하였습니다. \n ${error}`);
    }
  }

  async function send(token: string) {
    try {
      toast.warn("전송 중 입니다.");
      let res;
      if (token === "BNB") {
        await sendCoin({
          fromAddress: addresslist[targetAddress],
          toAddress: transferData.toAddress,
          amount: transferData.amount,
          gas: transferData.gas,
          gasPrice: transferData.gasPrice,
        });
      } else {
        await sendToken({
          fromAddress: addresslist[targetAddress],
          toAddress: transferData.toAddress,
          amount: transferData.amount,
          gas: transferData.gas,
          gasPrice: transferData.gasPrice,
        });
      }
      toast.success("전송이 완료 되었습니다.");
    } catch (error) {
      toast.error("전송 중 문제가 발생하였습니다.");
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
          <Button
            className="button"
            variant="warning"
            onClick={() => openTransferModal("BNB")}
          >
            전송
          </Button>
          <Button className="button" variant="warning" onClick={goLogPage}>
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
                    <Button
                      variant="warning"
                      onClick={() => openTransferModal("TTS")}
                    >
                      전송
                    </Button>
                  </div>
                </TableData>
              </TableRow>
            </tbody>
          </Table>
        </div>
        {(isLoading || isBalanceLoading) && (
          <ReactLoading className="loading" type="spin" />
        )}
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={getGasPriceInfo}
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            },
            content: {
              position: "absolute",
              top: "40px",
              left: "40px",
              right: "40px",
              bottom: "40px",
              background: theme.colors.BackGround,
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: "5px",
              outline: "none",
              padding: "20px",
              color: theme.colors.White,
            },
          }}
          onRequestClose={closeTransferModal}
          ariaHideApp={false}
        >
          <div
            style={{ float: "right", fontSize: "16px", fontWeight: 700 }}
            onClick={closeTransferModal}
          >
            X
          </div>
          <div
            className="transfer-title mb-4 mt-4"
            style={{ fontWeight: 700, fontSize: "1.6rem", textAlign: "center" }}
          >
            {token} 코인 보내기
          </div>
          <Form.Group className="form-group">
            <p
              className="mb-4 mt-4"
              style={{
                fontWeight: 700,
                fontSize: "1.4rem",
                textAlign: "center",
              }}
            >
              받는 주소
            </p>
            <Form.Control
              className="form"
              type="text"
              name="address"
              value={transferData.toAddress}
              onChange={async (e) => {
                if (e.target.value.length === 42) {
                  await getGasinfo(e.target.value);
                }
                console.log(transferData.toAddress);
              }}
              placeholder="enter Address"
            />

            <p
              className="mb-4 mt-4"
              style={{
                fontWeight: 700,
                fontSize: "1.4rem",
                textAlign: "center",
              }}
            >
              Amount
            </p>

            <Form.Control
              className="form center"
              type="number"
              name="value"
              value={transferData.amount}
              onChange={(e) => {
                setTransferData({
                  ...transferData,
                  amount: Number(e.target.value),
                });
              }}
              placeholder="enter Amount"
            />
            <p
              className="mb-4 mt-4"
              style={{ color: "red", fontSize: "1rem", textAlign: "center" }}
            >
              전송 가능 금액 {balance}
            </p>
          </Form.Group>

          <ModalStyle>
            <div className="gas-price">
              <p className="title"> Gas</p>
              <Form.Control
                disabled
                className="form center"
                type="text"
                value={transferData.gas}
                name="value"
                placeholder="enter your password"
              />
            </div>
            <div className="gas-price">
              <p className="title">Gas Price</p>
              <Form.Control
                disabled
                className="form center"
                type="text"
                name="value"
                value={transferData.gasPrice}
                onChange={(e) => {
                  onChangeTransferForm(e, "gasPrice");
                }}
                placeholder="enter your password"
              />
            </div>
          </ModalStyle>

          <Button
            className="form"
            variant="warning"
            style={{
              width: "90%",
              position: "absolute",
              bottom: " 20px",
              left: "5%",
            }}
            onClick={() => send(token)}
          >
            전송
          </Button>
        </Modal>
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
  .form {
    margin: 0.5rem;
    display: inline-block;
    width: 80%;
  }
  .form-group {
    display: flex;
    margin-top: 2rem;
    text-align: center;
  }
  .modal {
    color: red;
    position: absolute;
    top: "40px";
              left: "40px";
              right: "40px";
              bottom: "40px";
              background: ${theme.colors.BackGround}
              overflow: "auto";
              border-radius: "5px";
              outline: "none";
              padding: "20px";
              color: ${theme.colors.White}
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
const ModalStyle = styled.div`
  .title {
    font-size: 1.2rem;
    font-weight: 700;
    width: 10rem;
  }
  .gas-price {
    display: flex;
    flex-direction: row;
    margin-bottom: 2rem;
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
