import React, { useState, useMemo } from "react";
import { Navigate, Outlet, useOutletContext, useMatch } from "react-router-dom";

import { useAuth } from "../AuthContext";
import { useColorMode } from "../Theme";
import { useProjects } from "../ProjectsContext";
import LoadingApp from "./Loading";
import ProjectsList from "./ProjectsList";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function Main(props) {
  const auth = useAuth();
  const { loading } = useProjects();
  const rootPath = useMatch("/");

  return useMemo(
    () => (
      <>
        {!auth.user ? (
          <Navigate to="/welcome" />
        ) : loading ? (
          <LoadingApp message={"Loading projects"} />
        ) : rootPath ? (
          <Navigate to="/project/" />
        ) : (
          <MainContent />
        )}
      </>
    ),
    [auth.user, loading, rootPath]
  );
}

function MainContent(props) {
  const theme = useTheme();
  const colorMode = useColorMode();
  const smallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const drawerWidth = 240;
  const [drawerOpen, setDrawerOpen] = useState(!smallScreen);
  const drawerToggle = () => setDrawerOpen((drawerOpen) => !drawerOpen);

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
        <Divider />
        <UserButtons />
        <Divider />
        <ProjectsList />
        <div style={{ flexGrow: 1 }} />
        <Divider />
        <ThemeSwitch />
      </Drawer>

      <Outlet context={{ drawerWidth, drawerOpen, drawerToggle }} />
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
  return <Box sx={{ flexGrow: 1 }}>{props.children}</Box>;
}

export function MainSidebar(props) {
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

export function MainSidebarHeader(props) {
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

function UserButtons(props) {
  const auth = useAuth();

  const [nestedListOpen, setNestedListOpen] = useState(false);
  const toggleNestedList = () => setNestedListOpen(!nestedListOpen);

  return (
    <List>
      <ListItemButton
        key="user"
        onClick={toggleNestedList}
        selected={nestedListOpen}
      >
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText>{auth.user.username}</ListItemText>
        {nestedListOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={nestedListOpen} timeout="auto">
        <List component="div" disablePadding>
          <ListItemButton key="settings-button">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </ListItemButton>

          <ListItemButton key="logout-button" onClick={auth.logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText>Log Out</ListItemText>
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
}

function ThemeSwitch(props) {
  const colorMode = useColorMode();

  return (
    <List>
      <ListItemButton onClick={colorMode.toggleColorMode}>
        <ListItemIcon>
          {colorMode.mode === "light" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </ListItemIcon>
        <ListItemText
          primary={`Theme: ${colorMode.mode === "light" ? "Light" : "Dark"}`}
        />
      </ListItemButton>
    </List>
  );
}
