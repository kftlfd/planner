import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { useActions } from "../../context/ActionsContext";
import { selectUser } from "../../store/usersSlice";

import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export function UserButtons(props: { drawerToggle: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const actions = useActions();

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
        <ListItemText>{user.username}</ListItemText>
        {nestedListOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={nestedListOpen} timeout="auto">
        <List component="div" disablePadding>
          <ListItemButton
            key="settings-button"
            onClick={() => {
              if (location.pathname !== "/settings") navigate("/settings");
              props.drawerToggle();
            }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </ListItemButton>

          <ListItemButton key="logout-button" onClick={actions.auth.logout}>
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
