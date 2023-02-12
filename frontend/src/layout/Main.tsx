import React from "react";
import { useOutletContext } from "react-router-dom";

import { useColorMode } from "../context/ThemeContext";

import {
  Typography,
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  BoxProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

export function Main(props: {
  sx?: BoxProps["sx"];
  children?: React.ReactNode;
}) {
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
        ...props.sx,
      }}
    >
      {props.children}
    </Box>
  );
}

export function MainDrawer(props: {
  drawerOpen: boolean;
  drawerToggle: () => void;
  smallScreen: boolean;
  children?: React.ReactNode;
}) {
  const { drawerOpen, drawerToggle, smallScreen } = props;

  return (
    <Drawer
      variant={smallScreen ? "temporary" : "persistent"}
      anchor="left"
      open={drawerOpen}
      onClose={drawerToggle}
      ModalProps={{ keepMounted: true }}
      SlideProps={{ easing: "ease" }}
      transitionDuration={300}
      sx={{
        transition: "width 0.3s ease",
        width: drawerOpen ? drawerWidth : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar sx={{ justifyContent: "end" }}>
        <IconButton onClick={drawerToggle}>
          {smallScreen ? <CloseIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      {props.children}
    </Drawer>
  );
}

export function MainHeader(props: {
  title?: string;
  children?: React.ReactNode;
}) {
  const { drawerOpen, drawerToggle } = useOutletContext<{
    drawerOpen: boolean;
    drawerToggle: () => void;
  }>();

  return (
    <AppBar
      color={"background" as "default"}
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

export function MainBody(props: { children?: React.ReactNode }) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Toolbar />
      {props.children}
    </Box>
  );
}
