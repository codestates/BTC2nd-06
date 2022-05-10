import React from "react";
import styled from "styled-components";
import theme from "../theme";

function TopNav() {
  return (
    <HeaderContainer>
      <div className="left-area"></div>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  z-index: 100;
  position: fixed;
  display: flex;
  width: 37.5rem;
  height: 4.4rem;
  align-items: center;
  justify-content: space-between;
  top: 0;
  margin: auto 0;
  padding: 1.2rem;
  margin: 0 -16px;
  background-color: ${theme.colors.Yellow};
  .header-back {
    float: left;
    width: 2.4rem;
  }
  .header-menu {
    float: left;
    width: 2.4rem;
  }
  .header-profile {
    float: right;
    width: 2.4rem;
  }
  .header-title {
    font-size: 17px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.White};
  }
`;

export default TopNav;
