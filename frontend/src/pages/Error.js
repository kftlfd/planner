import React from "react";
import { useNavigate } from "react-router-dom";

import { Container, Typography, Button } from "@mui/material";

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
