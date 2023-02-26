import React from "react";
import { GlobalStyles, CssBaseline } from "@mui/material";

const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

  body {
    padding: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  #root {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
`;

const BaseStyles: React.FC = () => (
  <>
    <CssBaseline />
    <GlobalStyles styles={globalCss} />
  </>
);

export default BaseStyles;
