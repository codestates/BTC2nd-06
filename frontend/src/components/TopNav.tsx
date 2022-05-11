import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../theme";

function TopNav() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  return (
    <TopNavWrapper>
      <div className="back" onClick={goBack}>
        back
      </div>
      <div className="wallet"> wallet </div>
    </TopNavWrapper>
  );
}

const TopNavWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 5rem;
  color: white;
  justify-content: space-between;
  align-content: center;
  .wallet {
    width: 5rem;
    height: 5rem;
  }
  .back {
    width: 5rem;
    height: 5rem;
  }
`;

export default TopNav;
