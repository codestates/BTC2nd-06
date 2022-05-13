import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import styled from "styled-components";
import TopNav from "../components/TopNav";
import PageWrapper from "./page.styled";
import { toast } from "react-toastify";
import { createWallet } from "../common/api";
import ReactLoading from "react-loading";
import { useFetch } from "../common/fetchHook";
import theme from "../theme";

function WalletSignup() {
  const [signupStep, setSginupStep] = useState<number>(0);
  const [id, setId] = useState("");
  const [, fetchSignup, isLoading] = useFetch(createWallet);
  const [isShowMnemonic, setIsShowMnemonic] = useState(false);
  const [mnemonic, setMnemonic] = useState("");

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const warning =
    "경고: 이 키를 노출하지 마세요. \n 비공개 키가 있는 사람이라면 누구든 \n 귀하의 계정에 있는 자산을 훔칠 수 있습니다.";

  const stepDescription: { readonly [index: number]: string } = {
    0: "이용하실 \n ID와 PASSWORD를 \n 입력해주세요.",
    1: "지갑 생성하기",
    2: "지갑이 생성되었어요! \n복구 비밀 문구를 \n 안전하게 보관하세요. ",
  } as const;

  useEffect(() => {}, []);

  function nextStep() {
    if (signupStep === 0) {
      if (!id.length && !password.length) {
        toast.warn("ID와 PASSWORD를 입력 해주세요!");
        return;
      }
    }
    setSginupStep(signupStep + 1);
  }
  async function signup() {
    try {
      const res = await fetchSignup({ username: id, password });
      if (!res) {
        throw new Error();
      }
      setMnemonic(res.data.mnemonic);
      nextStep();
    } catch (error) {
      console.log(error);
      toast.warn(`회원가입 중 문제가 발생하였습니다. \n ${error}`);
    }
  }
  function goWalletPage() {
    navigate(`/wallet/my`);
  }

  return (
    <PageWrapper>
      <TopNav title={"Wallet"} />
      <WalletSignuoWrapper>
        <pre className="description">{stepDescription[signupStep]}</pre>
        {signupStep === 0 && (
          <div>
            <Form.Group className="form-group">
              <Form.Control
                className="form "
                type="text"
                name="id"
                onChange={(e) => {
                  setId(e.target.value);
                }}
                value={id}
                placeholder="enter your id"
              />
              <Form.Control
                className="form center"
                type="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="enter your password"
              />
            </Form.Group>
            <Button
              className="form center"
              size="lg"
              variant="warning"
              onClick={nextStep}
            >
              {"Next >"}
            </Button>
          </div>
        )}
        {signupStep === 1 && (
          <div className="step-2">
            <span className="id">{id} 님</span>
            <span className="id">환영합니다!</span>
            <Button
              className="sid-gen-button"
              variant="warning"
              onClick={signup}
            >
              가입하고 지갑 생성하기
            </Button>
          </div>
        )}
        {signupStep === 2 && (
          <div className="step-3">
            <pre className="warning-text">{warning}</pre>
            <div
              className="mnemonic"
              onClick={() => {
                setIsShowMnemonic(!isShowMnemonic);
              }}
            >
              {!isShowMnemonic ? <p>동의하고 보기</p> : <p>{mnemonic}</p>}
            </div>
            <Button
              className="sid-gen-button"
              variant="warning"
              onClick={goWalletPage}
            >
              내 지갑
            </Button>
          </div>
        )}
        {isLoading && <ReactLoading className="loading" type="spin" />}
      </WalletSignuoWrapper>
    </PageWrapper>
  );
}

const WalletSignuoWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  .loading {
    position: fixed;
    top: calc(40% - 32px);
    left: calc(50% - 32px);
  }
  .description {
    margin-top: 6rem;
    font-size: 2rem;
    font-weight: 700;
    color: ${theme.colors.Yellow};
    text-align: center;
    word-break: keep-all;
    line-height: 3rem;
  }
  .step-2 {
    display: flex;
    flex-direction: column;
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    text-align: center;
    font-size: 2rem;
    .id {
      margin: 3rem 0 0 1rem;
    }

    .sid-gen-button {
      width: 50%;
      height: 5rem;
      margin: 3rem auto;
      font-weight: 700;
    }
  }
  .step-3 {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 30rem;
    display: flex;
    justify-content: center;
    align-content: center;
    text-align: center;
    font-size: 2rem;
    .warning-text {
      font-size: 1.4rem;
      margin: 1rem 0;
      color: red;
    }
    .mnemonic {
      width: 80%;
      height: 60%;
      display: flex;
      background-color: gray;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      margin-bottom: 2rem;
      border-radius: 0.5rem;
    }
  }
  .form {
    margin: 0.5rem;
    display: inline-block;
    width: 100%;
  }
  .form-group {
    margin-top: 2rem;
    text-align: center;
  }
  .nav-button {
    width: 100%;
    display: flex;
    position: absolute;
    bottom: 0;
    margin-bottom: 30%;
    justify-content: space-between;
    align-content: center;
  }
  .right {
    position: absolute;
    right: 0;
  }
  .left {
    position: absolute;
    left: 0;
  }
`;

export default WalletSignup;
