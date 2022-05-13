import styled from "styled-components";
import theme from "../theme";

// style={{ width: 500, height: 800, backgroundColor: "tomato" }}
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 37.5rem;
  height: 60rem;
  background-color: ${theme.colors.BackGround};
  padding: 0rem 2rem;
  color: ${theme.colors.White};

  .search-form {
    display: flex;
  }
  .toggle-white {
    color: ${theme.colors.White};
  }
  .loading {
    position: fixed;
    top: calc(40% - 32px);
    left: calc(50% - 32px);
  }
`;

export const modalStyle = {
  content: {
    position: "absolute",
    top: "40px",
    left: "40px",
    right: "40px",
    bottom: "40px",
    background: theme.colors.BackGround,
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: "5px",
    outline: "none",
    padding: "20px",
    color: theme.colors.White,
  },
};

export default PageWrapper;
