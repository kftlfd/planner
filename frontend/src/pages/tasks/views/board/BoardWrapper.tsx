import { FC } from "react";

import { Box, Container } from "@mui/material";

export const BoardWrapper: FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <Container
      sx={{
        flexGrow: 1,
        paddingBottom: { xs: "1rem", sm: "1.5rem" },
        display: "flex",
        overflow: "scroll",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          marginInline: "-0.5rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    </Container>
  );
};
