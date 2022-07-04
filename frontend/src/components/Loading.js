import React from "react";

import { useColorMode } from "../Theme";

import Typography from "@mui/material/Typography";
import { Box, Card, LinearProgress } from "@mui/material";

export default function LoadingApp(props) {
  const colorMode = useColorMode();

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        backgroundColor:
          colorMode.mode === "light"
            ? "background.light"
            : "background.default",
      }}
    >
      <Card
        sx={{
          margin: "3rem",
          flexGrow: 1,
          display: "grid",
          placeContent: "center",
          gap: "1rem",
        }}
      >
        <img src="/favicon-192x192.png" alt="Loading" />
        <Typography
          variant="h5"
          component="div"
          sx={{ textAlign: "center", height: "2rem" }}
        >
          {props.message}
        </Typography>
        <LinearProgress />
      </Card>
    </Box>
  );
}
