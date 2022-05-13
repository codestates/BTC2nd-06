import React, { useEffect, useState } from "react";
import PageWrapper from "./page.styled";
import styled from "styled-components";
import { Button, Form, Col, Row, Table, ButtonGroup } from "react-bootstrap";
import { getSlaveWalletInfo } from "../common/api";
import TopNav from "../components/TopNav";
import theme from "../theme";
import web3 from "../contracts";

import { useSearchParams } from "react-router-dom";

function WalletLogList() {
  const [searchParams] = useSearchParams();
  const targetAddr = searchParams.get("addr")!;
  const [historyList, setHistoryList] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      await getHistory();
    })();
  }, []);

  async function getHistory() {
    try {
      const { data } = await getSlaveWalletInfo({ address: targetAddr });
      const filtered = data.transactions!.map((e: any) => {
        const state = e.value >= 0 ? "Receive" : "Send";
        const target = e.value >= 0 ? e.sender_address : e.recipient_address;
        const v = web3.utils.fromWei(String(Math.abs(e.value)), "ether");
        const value = e.value >= 0 ? v : "- " + v;
        const trx_hash = e.trx_hash;
        return { state, target, value, trx_hash };
      });
      setHistoryList([...filtered]);
    } catch (error) {}
  }

  return (
    <PageWrapper>
      <TopNav></TopNav>
      <WalletLogListWrapper>
        <div className="title-addr mb-2">거래 기록</div>
        <div className="title-addr mb-4">{targetAddr}</div>
        <Table className="mb-0" striped bordered hover variant="dark">
          <tbody>
            {historyList.map((e, idx) => {
              return (
                <TableRow>
                  <TableData>
                    <div className="contents-top mb-2">
                      <div
                        className={
                          "contents type" +
                          (e.state === "Send" ? " red" : " blue")
                        }
                      >
                        {e.state}
                      </div>
                      <div className="contents">{e.value}</div>
                      <div className="contents">TxHs: {e.trx_hash}</div>
                    </div>
                    <div className="contents-top">
                      <div className="contents">{e.target}</div>
                    </div>
                  </TableData>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </WalletLogListWrapper>
    </PageWrapper>
  );
}

const WalletLogListWrapper = styled.div`
  .title-addr {
    font-size: 1.2rem;
    text-align: center;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
  }
  .red {
    color: tomato;
    border: 1px solid tomato;
  }
  .blue {
    color: #0d6efd;
    border: 1px solid #0d6efd;
  }
`;
const TableRow = styled.tr`
  width: 100%;
  height: 5rem;
  align-items: center;
  text-align: center;
  font-size: 14px;
`;
const TableData = styled.td`
  max-width: 33rem;
  height: 5rem;
  align-items: center;
  flex-direction: column;
  background-color: ${theme.colors.BackGround};
  color: ${theme.colors.White};
  .contents-top {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 50%;
    margin-bottom: 2px;
    margin-top: 2px;
    .contents {
      margin: 0 0.5rem;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: normal;
      margin: 5px;
    }
    .type {
      padding: 2px;
      border: 1px solid white;
      border-radius: 0.4rem;
      width: 200px;
    }
  }
`;
export default WalletLogList;
