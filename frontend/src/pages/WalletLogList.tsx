import React, { useEffect, useState } from "react";
import PageWrapper from "./page.styled";
import styled from "styled-components";

function WalletLogList() {
  useEffect(() => {}, []);

  return (
    <PageWrapper>
      <WalletLogList></WalletLogList>
    </PageWrapper>
  );
}

const WalletLogListWrapper = styled.div``;

export default WalletLogList;
