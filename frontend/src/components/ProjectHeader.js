import React, { useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useProjects } from "../ProjectsContext";

import Typography from "@mui/material/Typography";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";

export default function Project(props) {
  const { projects, handleProjects } = useProjects();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [hideDoneTasks, setHideDoneTasks] = useState(false);

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const toggleRenameDialog = () => setRenameDialogOpen(!renameDialogOpen);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const toggleDeleteDialog = () => setDeleteDialogOpen(!deleteDialogOpen);

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
    const openOptionsMenu = (e) => setAnchorEl(e.currentTarget);
    const closeOptionsMenu = () => setAnchorEl(null);

    return (
      <>
        <IconButton
          id="project-options-button"
          aria-controls={open ? "project-options-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={openOptionsMenu}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="project-options-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={closeOptionsMenu}
          MenuListProps={{
            "aria-labelledby": "project-options-button",
          }}
        >
          <MenuItem onClick={() => setHideDoneTasks(!hideDoneTasks)}>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={hideDoneTasks} />}
                label="Hide done"
                labelPlacement="start"
                sx={{ marginInline: "0" }}
              />
            </FormGroup>
          </MenuItem>
          <Divider />
          <MenuItem onClick={toggleRenameDialog}>Rename</MenuItem>
          <Divider />
          <MenuItem onClick={toggleDeleteDialog}>Delete</MenuItem>
        </Menu>
      </>
    );
  };

  const ProjectRenameModal = ({ project }) => {
    const handleClose = () => toggleRenameDialog();

    const handleRename = async (e) => {
      e.preventDefault();
      await handleProjects.update(project.id, { name: renameValue });
      handleClose();
    };

    const [renameValue, setRenameValue] = useState(project.name);
    const handleRenameChange = (e) => setRenameValue(e.target.value);

    return (
      <Dialog open={renameDialogOpen} onClose={handleClose}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          Rename project
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleRename}>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              type={"text"}
              value={renameValue}
              placeholder={"Project name"}
              onChange={handleRenameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button type={"submit"} disabled={!renameValue}>
              Rename
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  };

  const ProjectDeleteModal = ({ project }) => {
    const handleClose = () => toggleDeleteDialog();

    const handleDelete = async () => {
      await handleProjects.delete(project.id);
      handleClose();
      navigate("/project/");
    };

    return (
      <Dialog open={deleteDialogOpen} onClose={handleClose}>
        <DialogTitle>Delete project "{project.name}"?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone, all tasks in project will be deleted
            too.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color={"error"}>
            Delete
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
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
            <ProjectRenameModal project={projects[Number(projectId)]} />
            <ProjectDeleteModal project={projects[Number(projectId)]} />
          </>
        ) : (
          <Header>Project not found</Header>
        )
      ) : (
        <Header>Select a project</Header>
      )}
      <Outlet context={{ hideDoneTasks }} />
    </div>
  );
}
