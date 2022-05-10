import React from "react";
import { Button } from "react-bootstrap";
import { web3 } from "../contracts/index";
function Home() {
  web3.eth.getBlockNumber(function (err, rtn) {
    var latest_block_number = rtn;
    for (var i = latest_block_number - 10; i <= latest_block_number; i++) {
      web3.eth.getBlock(i, false, function (err, block) {
        console.log(block);
      });
    }
  });
  return (
    <div >
      <Button>Main</Button>
    </div>
  );
}

export default Home;
