import { FC } from "react";

import { Box, Link } from "@mui/material";

export const Footer: FC = () => (
  <footer
    style={{
      paddingBlock: "1rem",
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <Box sx={{ marginRight: "0.3rem", color: "text.primary" }}>&copy;</Box>
    <Link
      href="mailto:kftlfd@ex.ua"
      target="_blank"
      rel="noreferrer"
      underline="hover"
    >
      kftlfd@ex.ua
    </Link>
    <Box sx={{ marginInline: ".5rem", color: "text.primary" }}>&bull;</Box>
    <Link
      href="https://github.com/kftlfd/planner"
      target="_blank"
      rel="noreferrer"
      underline="hover"
    >
      github.com/kftlfd/planner
    </Link>
  </footer>
);
