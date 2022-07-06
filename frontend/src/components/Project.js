import React, { useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useProjects } from "../ProjectsContext";
import { MainHeader, MainBody } from "./Main";

import {
  Typography,
  Box,
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
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function Project(props) {
  const { projects, handleProjects } = useProjects();
  const { projectId } = useParams();
  const validProject = projectId && projects[projectId];
  const navigate = useNavigate();

  const [hideDoneTasks, setHideDoneTasks] = useState(false);

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const toggleRenameDialog = () => setRenameDialogOpen(!renameDialogOpen);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const toggleDeleteDialog = () => setDeleteDialogOpen(!deleteDialogOpen);

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

  function Message({ text }) {
    return (
      <Typography
        variant="h4"
        align="center"
        sx={{
          marginTop: "3rem",
          fontWeight: "fontWeightLight",
          color: "text.primary",
        }}
      >
        {text}
      </Typography>
    );
  }

  function StarterMessage(props) {
    return (
      <>
        <Message text={"Select a project"} />
        <Box
          sx={{
            marginTop: "5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "fontWeightLight",
              color: "text.primary",
            }}
          >
            or
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "fontWeightLight",
              color: "text.primary",
            }}
          >
            Create New Project
          </Typography>
          <IconButton
            onClick={() =>
              document.getElementById("create-new-project-button").click()
            }
            sx={{
              svg: {
                fontSize: "10rem",
              },
            }}
          >
            <AddCircleIcon />
          </IconButton>
        </Box>
      </>
    );
  }

  return (
    <>
      <MainHeader title={validProject ? projects[projectId].name : "Project"}>
        {validProject ? (
          <>
            <ProjectOptionsMenu />
            <ProjectRenameModal project={projects[Number(projectId)]} />
            <ProjectDeleteModal project={projects[Number(projectId)]} />
          </>
        ) : null}
      </MainHeader>

      <MainBody>
        {!projectId ? (
          <StarterMessage />
        ) : !projects[projectId] ? (
          <Message text={"Project not found"} />
        ) : (
          <Outlet context={{ hideDoneTasks }} />
        )}
      </MainBody>
    </>
  );
}
