import { FC } from "react";

import { CssBaseline, GlobalStyles } from "@mui/material";

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

const gloablStyles = <GlobalStyles styles={globalCss} />;

const BaseStyles: FC = () => (
  <>
    <CssBaseline />
    {gloablStyles}
  </>
);

export default BaseStyles;
