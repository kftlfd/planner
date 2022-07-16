import React from "react";
import { useColorMode } from "../context/ThemeContext";
import { Box, Container, Card } from "@mui/material";

export function CenterCard({ children }) {
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
      }}
    >
      <Container maxWidth="xs">
        <Card sx={{ padding: "3rem" }}>{children}</Card>
      </Container>
    </Box>
  );
}
