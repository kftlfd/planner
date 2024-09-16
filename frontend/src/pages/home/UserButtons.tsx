import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { selectUser } from "~/store/usersSlice";

export const UserButtons: FC<{
  drawerToggle: () => void;
}> = ({ drawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const actions = useActions();

  const [nestedListOpen, setNestedListOpen] = useState(false);
  const toggleNestedList = () => {
    setNestedListOpen(!nestedListOpen);
  };

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
        <ListItemText>{user?.username}</ListItemText>
        {nestedListOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={nestedListOpen} timeout="auto">
        <List component="div" disablePadding>
          <ListItemButton
            key="settings-button"
            onClick={() => {
              if (location.pathname !== "/settings") navigate("/settings");
              drawerToggle();
            }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </ListItemButton>

          <ListItemButton
            key="logout-button"
            onClick={() => void actions.auth.logout()}
          >
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
