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
  width: 100%;
  height: 5rem;
`;

export default TopNav;
