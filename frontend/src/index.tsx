import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createGlobalStyle } from "styled-components";
import { ThemeProvider } from "styled-components";
import { reset } from "styled-reset";
import theme from "./theme";

export const GlobalStyle = createGlobalStyle`
  ${reset}
  :root {
        --bottom-safe-area: calc(env(safe-area-inset-bottom) * 0.7);
        --top-header-area: 4.4rem;
  }
  html{
        font-size: 62.5%; // = 10px = 1rem
        font-family: "AppleSDGothicNeo";
  }
  * {
      box-sizing: border-box;
  }
  ul {
    list-style: none;
    padding-left: 0;
  }
`;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <App />
  </ThemeProvider>
);
