import React from "react";

import { Drawer as MuiDrawer, Toolbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export function Drawer(props) {
  const { drawerOpen, drawerToggle, drawerWidth, smallScreen, children } =
    props;

  return (
    <MuiDrawer
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
    </MuiDrawer>
  );
}
