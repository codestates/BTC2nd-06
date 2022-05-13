import React, { useEffect, useState } from "react";
import PageWrapper from "./page.styled";
import styled from "styled-components";

function NotFound() {
  useEffect(() => {}, []);

  return (
    <PageWrapper>
      <NotFoundWrapper></NotFoundWrapper>
    </PageWrapper>
  );
}

const NotFoundWrapper = styled.div``;

export default NotFound;
