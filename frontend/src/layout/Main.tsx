import { FC, ReactNode } from "react";
import { useOutletContext } from "react-router-dom";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  BoxProps,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import { useColorMode } from "~/context/ThemeContext";

const drawerWidth = 240;

export const Main: FC<{
  sx?: BoxProps["sx"];
  children?: ReactNode;
}> = (props) => {
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
};

export const MainDrawer: FC<{
  drawerOpen: boolean;
  drawerToggle: () => void;
  smallScreen: boolean;
  children?: ReactNode;
}> = ({ drawerOpen, drawerToggle, smallScreen, children }) => (
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
    {children}
  </Drawer>
);

export const MainHeader: FC<{
  title?: string;
  children?: ReactNode;
}> = (props) => {
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
};

export const MainBody: FC<{ children?: ReactNode }> = ({ children }) => (
  <Box
    sx={{
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}
  >
    <Toolbar />
    {children}
  </Box>
);
