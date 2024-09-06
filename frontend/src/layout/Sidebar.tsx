import { FC, ReactNode } from "react";

import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  BoxProps,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import { useTheme } from "~/context/ThemeContext";

export const Sidebar: FC<{
  open: boolean;
  toggle: () => void;
  children?: ReactNode;
}> = ({ open, toggle, children }) => {
  const theme = useTheme();

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
      {children}
    </Drawer>
  );
};

export const SidebarHeader: FC<{
  title: string;
  toggle: () => void;
  children?: ReactNode;
}> = ({ title, toggle, children }) => {
  const theme = useTheme();

  return (
    <AppBar
      color={"background" as "default"}
      sx={{
        right: 0,
        width: { xs: "100%", sm: theme.breakpoints.values.sm },
      }}
    >
      <Toolbar>
        <IconButton
          onClick={toggle}
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
          {title}
        </Typography>

        {children}
      </Toolbar>
    </AppBar>
  );
};

export const SidebarBody: FC<{
  sx?: BoxProps["sx"];
  children?: ReactNode;
}> = ({ sx, children }) => (
  <>
    <Toolbar />
    <Box sx={{ padding: "2rem", ...sx }}>{children}</Box>
  </>
);
