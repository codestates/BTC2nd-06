import React, { useState } from "react";
import { Button, Form, Col, Row, Table } from "react-bootstrap";
import TopNav from "../components/TopNav";
import { web3 } from "../contracts/index";
import PageWrapper from "./page.styled";
function ExplorerHome() {
  const [latestBlock, setlatesBlock] = useState({});
  const fetch = function () {};
  web3.eth.getBlockNumber(function (err, rtn) {
    var latest_block_number = rtn;
    for (var i = latest_block_number - 1; i <= latest_block_number; i++) {
      web3.eth.getBlock(i, false, function (err, block) {
        console.log(block);
      });
    }
  });
  return (
    <PageWrapper>
      <TopNav></TopNav>
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
          <Col>
            <Row>
              <Form.Control
                className="mb-3 p-3"
                type="text"
                placeholder="Search by Address / Txn Hash / Block"
              />
              <Button>Main</Button>
            </Row>
          </Col>
        </Form.Group>
      </Form>
      <Col>
      </Col>
    </PageWrapper>
  );
}

export default ExplorerHome;
