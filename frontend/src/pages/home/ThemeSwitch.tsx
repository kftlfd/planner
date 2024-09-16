import { FC } from "react";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { useColorMode } from "~/context/ThemeContext";

export const ThemeSwitch: FC = () => {
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
