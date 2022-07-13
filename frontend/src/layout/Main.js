import React from "react";
import { useOutletContext } from "react-router-dom";

import { useColorMode } from "../context/ThemeContext";

import { Typography, Box, AppBar, Toolbar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export function MainWrapper(props) {
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
      {props.children}
    </Box>
  );
}

export function MainHeader(props) {
  const { drawerWidth, drawerOpen, drawerToggle } = useOutletContext();

  return (
    <AppBar
      color="background"
      sx={{
        transition: "all 0.3s ease",
        width: { md: drawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%" },
        marginLeft: { md: drawerOpen ? `${drawerWidth}px` : 0 },
      }}
    >
      <Toolbar>
        <IconButton
          onClick={drawerToggle}
          sx={{
            display: { md: drawerOpen ? "none" : "inline-flex" },
            marginRight: {
              xs: "1rem",
              sm: "1.5rem",
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h5"
          component="div"
          sx={{
            flexGrow: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {props.title}
        </Typography>

        {props.children}
      </Toolbar>
    </AppBar>
  );
}

export function MainBody(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Toolbar />
      {props.children}
    </Box>
  );
}
