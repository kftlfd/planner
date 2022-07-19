import React from "react";

import {
  Typography,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

export function Sidebar(props) {
  const theme = useTheme();
  const { open, toggle } = props;

  return (
    <Drawer
      anchor="right"
      variant="temporary"
      open={open}
      onClose={toggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: { xs: "100%", sm: theme.breakpoints.values.sm },
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: theme.breakpoints.values.sm },
          boxSizing: "border-box",
        },
      }}
    >
      {props.children}
    </Drawer>
  );
}

export function SidebarHeader(props) {
  const theme = useTheme();

  return (
    <AppBar
      color="background"
      sx={{
        right: 0,
        width: { xs: "100%", sm: theme.breakpoints.values.sm },
      }}
    >
      <Toolbar>
        <IconButton
          onClick={props.toggle}
          sx={{
            marginRight: {
              xs: "1rem",
              sm: "1.5rem",
            },
          }}
        >
          <CloseIcon />
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

export function SidebarBody(props) {
  return (
    <>
      <Toolbar />
      <Box sx={{ padding: "2rem", ...props.sx }}>{props.children}</Box>
    </>
  );
}
