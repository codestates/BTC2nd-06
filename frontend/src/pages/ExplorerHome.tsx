import React, { useState } from "react";
import { Button, Form, Col, Row, Table } from "react-bootstrap";
import TopNav from "../components/TopNav";
import web3 from "../contracts/index";
import PageWrapper from "./page.styled";
function ExplorerHome() {
  const [latestBlock, setlatesBlock] = useState({});
  web3.eth.getBlockNumber(function (err: object, rtn: any) {
    var latest_block_number = rtn;
    for (var i = latest_block_number; i <= latest_block_number; i++) {
      web3.eth.getBlock(i, false, function (err: any, block: any) {
        const { transactions } = block;
        transactions.forEach(async (t: string) => {
          console.log(await web3.eth.getBigGasLimitTransaction(t));
        });
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
                className="mb-3"
                type="text"
                placeholder="Search by Address / Txn Hash / Block"
              />
              <Button className="mb-3">Main</Button>
            </Row>
          </Col>
        </Form.Group>
      </Form>
      <Col>
        <Table striped bordered hover size="lg">
          <thead>
            <tr className="w-44">
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>3</td>
              <td colSpan={2}>Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table>
      </Col>
    </PageWrapper>
  );
}

export default ExplorerHome;
