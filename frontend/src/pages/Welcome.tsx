import React from "react";
import { useNavigate } from "react-router-dom";

import { CenterCard } from "../layout/CenterCard";
import { Logo } from "../layout/Logo";

import { Box, Button, Link, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <CenterCard ContainerWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", sm: "row" },
          justifyContent: { xs: "center", sm: "space-between" },
          alignItems: { xs: "center", sm: "start" },
          gap: "1.5rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", sm: "start" },
            gap: "1rem",
          }}
        >
          <Typography variant="h2">Planner</Typography>
          <Typography
            variant="h5"
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            Task tracking with real-time collaboration
          </Typography>

          <Link
            href="https://www.youtube.com/watch?v=1GzO4nYecYU"
            target="_blank"
            rel="noreferrer"
            underline="none"
          >
            <Button endIcon={<OpenInNewIcon />}>Watch demo on YouTube</Button>
          </Link>

          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Button variant="contained" onClick={() => navigate("/register")}>
              Sign Up
            </Button>
            <Button variant="outlined" onClick={() => navigate("/login")}>
              Log In
            </Button>
          </Box>
        </Box>
        <Logo height={190} />
      </Box>
    </CenterCard>
  );
}
