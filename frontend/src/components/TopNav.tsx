import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

import {
  IconLookup,
  IconDefinition,
  findIconDefinition,
} from "@fortawesome/fontawesome-svg-core";
library.add(fas);

const iconWallet: IconLookup = { prefix: "fas", iconName: "wallet" };
const walletIconDefinition: IconDefinition = findIconDefinition(iconWallet);
const iconExplorer: IconLookup = {
  prefix: "fas",
  iconName: "magnifying-glass",
};
const iconExplorerDefinition: IconDefinition = findIconDefinition(iconExplorer);

function TopNav({ title }: { title: string }) {
  const navigate = useNavigate();
  function goBack() {
    navigate(-1);
  }
  function goWallet() {
    navigate("/wallet");
  }
  function goExplorer() {
    navigate("/");
  }
  return (
    <TopNavWrapper>
      <div className="icon left " onClick={goBack}>
        <span>{"<"}</span>
      </div>
      <div className="title" style={{ textAlign: "center" }}>
        {title}
      </div>
      <div className="icon right" onClick={goExplorer}>
        <FontAwesomeIcon
          className="fa-2x highlight"
          icon={iconExplorerDefinition}
        />
      </div>
      <div className="icon right" onClick={goWallet}>
        <FontAwesomeIcon className="fa-2x" icon={walletIconDefinition} />
      </div>
    </TopNavWrapper>
  );
}

const TopNavWrapper = styled.div`
  width: 100%;
  height: 5rem;
  color: white;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  .icon {
    display: flex;
    justify-content: center;
    align-content: center;
    width: 2.5rem;
    height: 2.5rem;
  }
  .title {
    display: inline-block;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 13px;
    position: absolute;
    left: 42%;
  }
  .wallet {
    width: 10px;
  }
  .right {
    float: right;
    margin-left: 1rem;
  }
  .left {
    float: left;
    font-size: 2.7rem;
    font-weight: 700;
    line-height: 15px;
  }
`;

export default TopNav;
