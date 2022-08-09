import React, { useState, useRef } from "react";

import { ProjectHideDoneToggle } from "./ProjectHideDoneToggle";
import { ProjectSharing } from "./ProjectSharing";
import { ProjectRename } from "./ProjectRename";
import { ProjectDelete } from "./ProjectDelete";
import { ProjectLeave } from "./ProjectLeave";

import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export function ProjectOptionsMenu(props) {
  const optionsButton = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const openOptionsMenu = () => setMenuOpen(true);
  const closeOptionsMenu = () => setMenuOpen(false);

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
        {props.children}
        <ProjectHideDoneToggle />
        <ProjectSharing closeOptionsMenu={closeOptionsMenu} />
        <ProjectRename closeOptionsMenu={closeOptionsMenu} />
        <ProjectDelete closeOptionsMenu={closeOptionsMenu} />
        <ProjectLeave closeOptionsMenu={closeOptionsMenu} />
      </Menu>
    </>
  );
}

export function MenuListItem(props) {
  return (
    <MenuItem
      onClick={props.onClick}
      sx={{
        height: "3rem",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.5rem",
        ...props.sx,
      }}
    >
      {props.children}
    </MenuItem>
  );
}
