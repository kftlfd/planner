import React from "react";
import { Container, Box } from "@mui/material";

type BoardWrapperProps = {
  children?: React.ReactNode;
};

export const BoardWrapper: React.FC<BoardWrapperProps> = ({ children }) => {
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
