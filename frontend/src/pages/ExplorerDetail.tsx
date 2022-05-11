import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { BlockInfo, Transaction } from "../interfaces";
import { Table, Card } from "react-bootstrap";
import styled from "styled-components";
import TopNav from "../components/TopNav";
import web3 from "../contracts/index";
import ReactLoading from "react-loading";
import PageWrapper from "./page.styled";

function ExplorerDetail() {
  const [searchParams] = useSearchParams();
  const [targetDetail, setTargetDetail] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<string>();

  useEffect(() => {
    getHashInfo();
  }, []);

  async function getHashInfo() {
    const type = searchParams.get("type")!;
    const target = searchParams.get("hx")!;
    let data;
    if (type === "block") {
      data = await web3.eth.getBlock(target);
    } else {
      data = await web3.eth.getBigGasLimitTransaction(target);
      const status = await web3.eth.getTransactionReceipt(target);
      setTxStatus(!status ? "success" : "panding");
    }
    filterData(type, data, target);
  }

  async function filterData(type: string, data: Transaction, target: string) {
    const filteredData =
      type === "tx"
        ? {
            transactionHash: target,
            status: txStatus,
            block: data["blockHash"],
            from: data["from"],
            to: data["to"],
            value: await web3.utils.fromWei(String(data!.value), "ether"),
            txFee: await web3.utils.fromWei(String(data!.gasPrice), "ether"),
          }
        : {};
    setIsLoading(true);
    setTargetDetail(filteredData);
  }

  return (
    <PageWrapper>
      <TopNav />
      <div className="detail_title">
        {searchParams.get("type") === "block" && <div>Block Info</div>}
        {searchParams.get("type") === "tx" && <div>Transaction Info</div>}
      </div>
      {!isLoading && <ReactLoading className="loading" type="spin" />}
      {targetDetail && (
        <Card>
          <Table className="mb-0" bordered variant="dark" size="lg">
            <tbody>
              {Object.keys(targetDetail).map((e, idx) => {
                return (
                  <TableRow key={`detail-tx-${idx}`}>
                    <TableData>{e}: </TableData>
                    <TableData>{targetDetail[e]}</TableData>
                  </TableRow>
                );
              })}
            </tbody>
          </Table>
        </Card>
      )}
    </PageWrapper>
  );
}

const TableRow = styled.tr`
  height: auto;
  border: 0.3rem solid #6c757d99;
  border-radius: 0.5rem;
  word-break: break-all;
  font-size: 14px;
`;
const TableData = styled.td`
  max-width: 33rem;
  height: 5rem;
  align-items: center;
  flex-direction: column;
`;

export default ExplorerDetail;
