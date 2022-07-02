import React, { useState } from "react";
import { useParams, Outlet } from "react-router-dom";
import { useProjects } from "../ProjectsContext";

import Typography from "@mui/material/Typography";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function Project(props) {
  const { projectId } = useParams();
  const { projects } = useProjects();

  const Header = (props) => (
    <Typography
      variant="h4"
      component="div"
      gutterBottom
      sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
    >
      {props.children}
    </Typography>
  );

  const ProjectOptionsMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
      <>
        <IconButton
          id="project-options-button"
          aria-controls={open ? "project-options-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleOpen}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="project-options-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}>Rename</MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>Delete</MenuItem>
        </Menu>
      </>
    );
  };

  const ProjectRenameModal = () => {
    return (
      <Dialog open={false} onClose={() => {}}>
        <DialogTitle>Rename project</DialogTitle>
        <form>
          <TextField />
          <Button />
        </form>
      </Dialog>
    );
  };

  const ProjectDeleteModal = () => {
    return (
      <Dialog open={false} onClose={() => {}}>
        <DialogTitle>Delete project [project name] ?</DialogTitle>
        <Button>Delete</Button>
        <Button>Cancel</Button>
      </Dialog>
    );
  };

  return (
    <div
      style={{
        flexGrow: "1",
        padding: "1rem",
      }}
    >
      {projectId ? (
        projects[Number(projectId)] ? (
          <>
            <Header>
              {projects[Number(projectId)].name}
              <ProjectOptionsMenu />
            </Header>
            <ProjectRenameModal />
            <ProjectDeleteModal />
          </>
        ) : (
          <Header>Project not found</Header>
        )
      ) : (
        <Header>Select a project</Header>
      )}
      <Outlet />
    </div>
  );
}
