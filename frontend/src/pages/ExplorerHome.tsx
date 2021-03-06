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
import styled from "styled-components";
import PageWrapper from "./page.styled";
import theme from "../theme";
import { BlockInfo, Transaction } from "../interfaces";
import { useNavigate } from "react-router-dom";

interface ExplorerHomeProps {
  latestTxList: Transaction[];
  latestBlock: BlockInfo[];
}

function ExplorerHome({ latestTxList, latestBlock }: ExplorerHomeProps) {
  const [radioValue, setRadioValue] = useState("block");
  const [searchKey, setSearchKey] = useState("");
  let navigate = useNavigate();

  const radios = [
    { name: "Latest Blocks", value: "block" },
    { name: "Latest Transactions", value: "tx" },
  ];

  useEffect(() => {}, []);

  function onClickSearch(searchKey: string) {
    let searchType = "tx";
    if (/^[0-9]+$/.test(searchKey)) {
      searchType = "block";
    }
    goToDetail(searchType, searchKey);
  }

  function goToDetail(type: string, hx: string) {
    navigate(`/explorer?type=${type}&hx=${hx}`);
  }

  return (
    <PageWrapper>
      <TopNav title={"Explorer"}></TopNav>
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
          <Col className="search-form">
            <Form.Control
              className="mb-3"
              name="search"
              type="text"
              onChange={(e) => {
                setSearchKey(e.target.value);
              }}
              placeholder="Search by Txn Hash / Block number"
            />
            <Button onClick={() => onClickSearch(searchKey)} className="mb-3">
              🔎
            </Button>
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
              {radioValue === "block"
                ? latestBlock.map((e, idx) => (
                    <TableRow
                      onClick={() => goToDetail("block", String(e.number))}
                      className="mb-4"
                      key={`block-last` + idx}
                    >
                      <TableData>
                        <div className="contents-top mb-2">
                          <div className="contents type">Bk</div>
                          <div className="contents">{e.number}</div>
                          <div className="contents">
                            Txns: {e.transactions.length}
                          </div>
                        </div>
                        <div className="contents-top">
                          <div className="contents">
                            Validated by: {e.miner}
                          </div>
                        </div>
                      </TableData>
                    </TableRow>
                  ))
                : latestTxList.map((e, idx) => (
                    <TableRow
                      onClick={() => goToDetail("tx", e.txHash)}
                      className="mb-4"
                      key={idx}
                    >
                      <TableData>
                        <div className="contents-top mb-2">
                          <div className="contents type">Tx</div>
                          <div className="contents">{e.txHash}</div>
                          <div className="contents">{e.value} BNB</div>
                        </div>
                        <div className="contents-top">
                          <div className="contents">From: {e.from}</div>
                          <div className="contents">To: {e.to}</div>
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
    }
    .type {
      padding: 2px;
      border: 1px solid white;
      border-radius: 0.4rem;
      max-width: 4rem;
    }
  }
`;
export default ExplorerHome;
