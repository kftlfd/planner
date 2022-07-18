import React from "react";
import { useColorMode } from "../context/ThemeContext";
import { Box, Container, Card } from "@mui/material";

export function CenterCard({ children, BoxSx, ContainerWidth }) {
  const colorMode = useColorMode();

  return (
    <Box
      sx={{
        flexGrow: 1,
        paddingTop: "3rem",
        backgroundColor:
          colorMode.mode === "light"
            ? "background.light"
            : "background.default",
        ...BoxSx,
      }}
    >
      <Container maxWidth={ContainerWidth || "xs"}>
        <Card sx={{ padding: "3rem" }}>{children}</Card>
      </Container>
    </Box>
  );
}
