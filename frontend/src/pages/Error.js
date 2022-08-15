import React from "react";
import { useNavigate } from "react-router-dom";

import { Container, Typography, Button, Box, Card } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Error(props) {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <Typography variant="h1" sx={{ color: "text.primary" }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ color: "text.primary" }}>
        Page not found
      </Typography>
      <Button onClick={() => navigate("/", { replace: true })}>
        Go to Homepage
      </Button>
    </Container>
  );
}

export function CookieError(props) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: prefersDarkMode ? "#121212" : "aliceblue",
        display: "grid",
        placeContent: "center",
        padding: "2rem",
      }}
    >
      <Card
        sx={{
          backgroundColor: prefersDarkMode ? "#1e1e1e" : "#fff",
          color: prefersDarkMode ? "#fff" : "#111",
          display: "grid",
          placeContent: "center",
          rowGap: "1.5rem",
          padding: "2rem",
        }}
      >
        <Typography variant="h3">Cookies are disabled</Typography>
        <Typography variant="h5">
          Please enable cookies to view this app
        </Typography>
        <Typography variant="body1">
          Cookies are used only for authentication
        </Typography>
      </Card>
    </Box>
  );
}
