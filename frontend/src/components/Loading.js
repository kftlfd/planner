import React from "react";

import { useColorMode } from "../context/ThemeContext";

import Typography from "@mui/material/Typography";
import { Box, Card, LinearProgress } from "@mui/material";

export function LoadingApp(props) {
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
          flexGrow: 1,
          margin: { xs: "1rem", sm: "2rem", md: "3rem" },
          display: "grid",
          placeContent: "center",
          gap: "1.5rem",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            fontSize: { xs: "5em", sm: "8em", md: "10em" },
          }}
        >
          📝
        </Box>

        <Typography
          component="div"
          sx={{
            height: "2rem",
            textAlign: "center",
            fontSize: { xs: "1em", sm: "1.15em", md: "1.25em" },
          }}
        >
          {props.message}
        </Typography>

        <LinearProgress sx={{ width: { xs: "8em", sm: "9em", md: "10em" } }} />
      </Card>
    </Box>
  );
}
