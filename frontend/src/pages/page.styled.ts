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

  .search-form {
    display: flex;
  }
  .toggle-white {
    color: ${theme.colors.White};
  }
`;

export default PageWrapper;
