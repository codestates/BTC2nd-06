import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import PageWrapper from "./page.styled";

function ExplorerDetail() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  console.log("!!!!", searchParams.get("type"));
  useEffect(() => {}, []);

  return (
    <PageWrapper>
      <div className="input-area">하이</div>
    </PageWrapper>
  );
}

export default ExplorerDetail;
