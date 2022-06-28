import React from "react";
import Drawer from "@mui/material/Drawer";

export default function ResposiveDrawer(props) {
  const { window } = props;
  const drawerWidth = 240;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerWidth,
          pt: "2rem",
        },
      }}
    >
      {props.children}
    </Drawer>
  );
}
