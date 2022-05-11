import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Col,
  Row,
  Table,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import TopNav from "../components/TopNav";
import web3 from "../contracts/index";
import styled from "styled-components";
import PageWrapper from "./page.styled";
import theme from "../theme";

interface Transaction {
  blockHash: string;
  blockNumber: number;
  from: string;
  gas: string;
  gasPrice: string;
  hash: string;
  input: string;
  nonce: number;
  r: string;
  s: string;
  to: string;
  transactionIndex: number;
  type: string;
  v: string;
  value: string;
}

function ExplorerHome() {
  const [latestBlock, setlatesBlock] = useState({});
  const [latestTxList, setlatestTxList] = useState<Transaction[]>([]);

  const [radioValue, setRadioValue] = useState("1");
  const radios = [
    { name: "Latest Blocks", value: "1" },
    { name: "Latest Transactions", value: "2" },
  ];

  useEffect(() => {
    getChainInfo();
  }, []);

  async function getChainInfo() {
    const lastBlockNum = await web3.eth.getBlockNumber();
    const LasBlockInfo = await web3.eth.getBlock(lastBlockNum, false);
    const { transactions } = LasBlockInfo;
    const latestTxList: Transaction[] = await Promise.all(
      transactions.map(async (t: string) => {
        const txList = await web3.eth.getBigGasLimitTransaction(t);
        return { ...txList, value: web3.utils.fromWei(txList.value, "ether") };
      })
    );
    console.log(latestTxList);
    setlatestTxList(latestTxList.splice(0, 7));
  }

  return (
    <PageWrapper>
      <TopNav></TopNav>
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
          <Col className="search-form">
            <Form.Control
              className="mb-3"
              type="text"
              placeholder="Search by Address / Txn Hash / Block"
            />
            <Button className="mb-3">🔎</Button>
          </Col>
        </Form.Group>
      </Form>
      <ButtonGroup className="mb-2">
        {radios.map((radio, idx) => (
          <ToggleButton
            key={idx}
            id={`radio-${idx}`}
            type="radio"
            variant={"outline-light"}
            name="radio"
            value={radio.value}
            checked={radioValue === radio.value}
            onChange={(e) => setRadioValue(e.currentTarget.value)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>

      <Col>
        <ExplorerWrapper>
          <Table className="mb-0" striped bordered hover variant="dark">
            <tbody>
              {latestTxList.map((e, idx) => (
                <TableRow key={idx}>
                  <TableData>
                    <div className="contents-top">
                      <div className="contents type">Tx</div>
                      <div className="contents hash">{e.blockHash}</div>
                      <div className="contents value">{e.value} BNB</div>
                    </div>
                    <div className="contents-top">
                      <div className="contents to">From: {e.from}</div>
                      <div className="contents from">To: {e.to}</div>
                    </div>
                  </TableData>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </ExplorerWrapper>
      </Col>
    </PageWrapper>
  );
}

const ExplorerWrapper = styled.div`
  height: auto;
  border: 0.3rem solid #6c757d99;
  border-radius: 0.5rem;
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
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${theme.colors.BackGround};
  color: ${theme.colors.White};
  .contents-top {
    position: relative;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 50%;
    margin-bottom: 2px;
    margin-top: 2px;
    .contents {
      display: flex;
      align-items: center;
      height: 100%;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0 4px;
    }
    .type {
      flex-grow: 1;
      width: 50px;
      border: 1px solid white;
      border-radius: 2px;
      justify-content: center;
    }
    .hash {
      flex-grow: 4;
    }
    .value {
      flex-grow: 2;
      min-width: 0;
    }
    .from {
      flex-grow: 1;
      min-width: 0;
    }
    .to {
      flex-grow: 1;
      min-width: 0;
    }
  }
`;
export default ExplorerHome;
