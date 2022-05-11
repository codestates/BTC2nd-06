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
      <div className="icon" onClick={goBack}>
        <span>back</span>
      </div>
      <div className="icon">
        <span> wallet </span>
      </div>
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
  .icon {
    display: flex;
    justify-content: center;
    align-content: center;
    width: 2.5rem;
    height: 2.5rem;
  }
`;

export default TopNav;
