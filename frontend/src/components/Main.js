import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useProjects } from "../ProjectsContext";
import ProjectsList from "./ProjectsList";

import {
  AppBar,
  Toolbar,
  Drawer,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

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

  return (
    <>
      {auth.user ? (
        loading ? (
          <div>Loading projects</div>
        ) : (
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <AppBar>
              <Toolbar />
            </AppBar>

            <NavDrawer>
              <Toolbar />
              <Divider />
              <UserButtons />
              <Divider />
              <ProjectsList />
            </NavDrawer>

            <Box sx={{ flexGrow: 1 }}>
              <Toolbar />
              <Outlet />
            </Box>
          </Box>
        )
      ) : (
        <Navigate to="/welcome" />
      )}
    </>
  );
}
