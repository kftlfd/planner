import React, { useState, useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../AuthContext";
import { useProjects } from "../ProjectsContext";
import ProjectsList from "./ProjectsList";
import { useColorMode } from "../Theme";

import {
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
import LoadingApp from "./Loading";

export default function Main(props) {
  const auth = useAuth();
  const { loading } = useProjects();
  const drawerWidth = 240;

  const NavDrawer = (props) => {
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
          },
        }}
      >
        {props.children}
      </Drawer>
    );
  };

  const UserButtons = () => {
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
  };

  const ThemeSwitch = () => {
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
  };

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
        <AppBar color="background">
          <Toolbar sx={{ marginLeft: `${drawerWidth}px` }}>
            <IconButton>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <NavDrawer>
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
        </NavDrawer>

        <Box sx={{ flexGrow: 1 }}>
          <Toolbar />
          <Outlet />
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
