import React, { useState, useMemo } from "react";
import { Navigate, Outlet, useOutletContext } from "react-router-dom";

import { useAuth } from "../AuthContext";
import { useColorMode } from "../Theme";
import { useProjects } from "../ProjectsContext";
import LoadingApp from "./Loading";
import ProjectsList from "./ProjectsList";

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
  const drawerWidth = 240;

  const MainContent = () => {
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
        <MainDrawer drawerWidth={drawerWidth}>
          <Toolbar sx={{ justifyContent: "end" }}>
            <IconButton>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <UserButtons />
          <Divider />
          <ProjectsList />
          <div style={{ flexGrow: 1 }} />
          <Divider />
          <ThemeSwitch />
        </MainDrawer>

        <Box sx={{ flexGrow: 1 }}>
          <Outlet context={{ drawerWidth }} />
        </Box>
      </Box>
    );
  };

  return useMemo(
    () => (
      <>
        {auth.user ? (
          loading ? (
            <LoadingApp message={"Loading projects"} />
          ) : (
            <MainContent />
          )
        ) : (
          <Navigate to="/welcome" />
        )}
      </>
    ),
    [auth.user, loading]
  );
}

function MainDrawer(props) {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: props.drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: props.drawerWidth,
        },
      }}
    >
      {props.children}
    </Drawer>
  );
}

export function MainHeader(props) {
  const { drawerWidth } = useOutletContext();

  return (
    <AppBar color="background">
      <Toolbar sx={{ marginLeft: `${drawerWidth}px` }}>
        <IconButton sx={{ marginRight: "1rem" }}>
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
    <>
      <Toolbar />
      <div style={{ padding: "1rem" }}>{props.children}</div>
    </>
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
