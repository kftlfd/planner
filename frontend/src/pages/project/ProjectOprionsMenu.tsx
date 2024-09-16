import { FC, ReactNode, useRef, useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem, SxProps } from "@mui/material";

import { ProjectDelete } from "./ProjectDelete";
import { ProjectHideDoneToggle } from "./ProjectHideDoneToggle";
import { ProjectLeave } from "./ProjectLeave";
import { ProjectRename } from "./ProjectRename";
import { ProjectSharing } from "./ProjectSharing";

export const ProjectOptionsMenu: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const optionsButton = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const openOptionsMenu = () => {
    setMenuOpen(true);
  };
  const closeOptionsMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <IconButton
        ref={optionsButton}
        id="project-options-button"
        aria-controls={menuOpen ? "project-options-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        onClick={openOptionsMenu}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="project-options-menu"
        anchorEl={optionsButton.current}
        keepMounted={true}
        open={menuOpen}
        onClose={closeOptionsMenu}
        MenuListProps={{
          "aria-labelledby": "project-options-button",
        }}
      >
        {children}
        <ProjectHideDoneToggle />
        <ProjectSharing closeOptionsMenu={closeOptionsMenu} />
        <ProjectRename closeOptionsMenu={closeOptionsMenu} />
        <ProjectDelete closeOptionsMenu={closeOptionsMenu} />
        <ProjectLeave closeOptionsMenu={closeOptionsMenu} />
      </Menu>
    </>
  );
};

export const MenuListItem: FC<{
  onClick?: () => void;
  sx?: SxProps;
  children?: ReactNode;
}> = ({ onClick, sx, children }) => (
  <MenuItem
    onClick={onClick}
    sx={{
      height: "3rem",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "0.5rem",
      ...sx,
    }}
  >
    {children}
  </MenuItem>
);
