import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BlockInfo, Transaction } from "../interfaces";
import { Table, Card } from "react-bootstrap";
import styled from "styled-components";
import TopNav from "../components/TopNav";
import web3 from "../contracts/index";
import ReactLoading from "react-loading";
import PageWrapper from "./page.styled";

function ExplorerDetail() {
  const [searchParams] = useSearchParams();
  const [targetDetail, setTargetDetail] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<string>();
  const [infoType] = useState<string>(searchParams.get("type") || "block");

  useEffect(() => {
    getHashInfo();
  }, []);

  async function getHashInfo() {
    const type = searchParams.get("type")!;
    const target = searchParams.get("hx")!;
    let data;
    setIsLoading(true);
    try {
      if (type === "block") {
        data = await web3.eth.getBlock(target);
      } else {
        data = await web3.eth.getBigGasLimitTransaction(target);
        const status = await web3.eth.getTransactionReceipt(target);
        setTxStatus(!status ? "success" : "panding");
      }
    } catch (error) {
      console.log(error);
      //no search result;
      setIsLoading(false);
    }

    filterData(type, data, target);
  }

  async function filterData(
    type: string,
    data: Transaction & BlockInfo,
    target: string
  ) {
    let filteredData =
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
        : {
            difficulty: data["difficulty"],
            blockHeight: data["number"],
            totalDifficulty: data["totalDifficulty"],
            gasLimit: data["gasLimit"],
            gasUsed: data["gasUsed"],
            miner: data["miner"],
            hash: data["hash"],
            size: data["size"],
            timestamp: data["timestamp"],
            transactions: data["transactions"].length,
          };
    setIsLoading(false);
    setTargetDetail(filteredData);
  }

  return (
    <PageWrapper>
      <DetailWrapper>
        <TopNav />
        <div className="detail-title">
          {infoType === "block" ? (
            <span>Block Info</span>
          ) : (
            <span>Transaction Info</span>
          )}
        </div>
        {isLoading && <ReactLoading className="loading" type="spin" />}
        {targetDetail && Object.keys(targetDetail).length ? (
          <Card>
            <Table className="mb-0" bordered variant="dark" size="lg">
              <tbody>
                {Object.keys(targetDetail).map((e, idx) => {
                  return (
                    <TableRow key={`detail-tx-${idx}`}>
                      <TableData className="header">{e}: </TableData>
                      <TableData>{targetDetail[e]}</TableData>
                    </TableRow>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        ) : (
          !isLoading && <span className="no-search">검색 결과가 없습니다.</span>
        )}
      </DetailWrapper>
    </PageWrapper>
  );
}

const DetailWrapper = styled.div`
  .detail-title {
    color: white;
    font-size: 16px;
    margin-bottom: 0.5rem;
  }
  .no-search {
    position: fixed;
    font-weight: 700;
    color: white;
    font-size: 16px;
    margin-bottom: 0.5rem;
    top: calc(40% - 32px);
    left: calc(40% - 32px);
  }
`;
const TableRow = styled.tr`
  height: auto;
  border: 0.3rem solid #6c757d99;
  border-radius: 0.5rem;
  word-break: break-all;
  font-size: 14px;
  .header {
    font-weight: 700;
  }
`;
const TableData = styled.td`
  max-width: 20rem;
  height: 4rem;
  align-items: center;
  flex-direction: column;
`;

export default ExplorerDetail;
