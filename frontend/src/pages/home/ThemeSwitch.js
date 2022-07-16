import React from "react";

import { useColorMode } from "../../context/ThemeContext";

import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export function ThemeSwitch(props) {
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
