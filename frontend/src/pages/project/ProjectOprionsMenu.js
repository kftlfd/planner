import React, { useState } from "react";

import { Sidebar } from "../../layout/Sidebar";
import { ProjectSharing } from "./ProjectSharing";
import { ProjectRenameModal, ProjectDeleteModal } from "./ProjectModals";

import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Checkbox,
  Divider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export function ProjectOptionsMenu(props) {
  const {
    projectId,
    projectSharing,
    projectSharingToggle,
    hideDoneValue,
    hideDoneToggle,
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const openOptionsMenu = (e) => setAnchorEl(e.currentTarget);
  const closeOptionsMenu = () => setAnchorEl(null);

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const toggleRenameDialog = () => {
    setRenameDialogOpen((x) => !x);
    closeOptionsMenu();
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const toggleDeleteDialog = () => {
    setDeleteDialogOpen((x) => !x);
    closeOptionsMenu();
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen((x) => !x);
    closeOptionsMenu();
  };

  return (
    <>
      <IconButton
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
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={closeOptionsMenu}
        MenuListProps={{
          "aria-labelledby": "project-options-button",
        }}
      >
        <MenuItem
          onClick={hideDoneToggle}
          sx={{ justifyContent: "space-between" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Hide done tasks
            <Switch checked={hideDoneValue} />
          </Box>
        </MenuItem>

        <Divider />
        <MenuItem
          onClick={toggleSidebar}
          sx={{ justifyContent: "space-between" }}
        >
          Project sharing
          <Checkbox color="success" checked={projectSharing} />
        </MenuItem>

        <Divider />
        <MenuItem onClick={toggleRenameDialog}>Rename</MenuItem>

        <Divider />
        <MenuItem onClick={toggleDeleteDialog}>Delete</MenuItem>
      </Menu>

      <Sidebar open={sidebarOpen} toggle={toggleSidebar}>
        <ProjectSharing
          projectId={projectId}
          projectSharing={projectSharing}
          projectSharingToggle={projectSharingToggle}
          toggleSidebar={toggleSidebar}
        />
      </Sidebar>
      <ProjectRenameModal
        open={renameDialogOpen}
        toggle={toggleRenameDialog}
        projectId={projectId}
      />
      <ProjectDeleteModal
        open={deleteDialogOpen}
        toggle={toggleDeleteDialog}
        projectId={projectId}
      />
    </>
  );
}
