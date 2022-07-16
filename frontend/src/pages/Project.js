import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import {
  updateProject,
  deleteProject,
  selectProjectById,
} from "../store/projectsSlice";

import * as api from "../api/client";

import { MainHeader, MainBody } from "../layout/Main";
import { Sidebar, SidebarHeader, SidebarBody } from "../layout/Sidebar";

import {
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Checkbox,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Toolbar,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function Project(props) {
  const { projectId } = useParams();
  const project = useSelector(selectProjectById(projectId));

  console.log(projectId);
  console.log(project);

  const [projectSharing, setProjectSharing] = useState(false);
  const projectSharingToggle = () => setProjectSharing((x) => !x);

  const [hideDoneTasks, setHideDoneTasks] = useState(false);
  const toggleHideDoneTasks = () => setHideDoneTasks((x) => !x);

  function Message(props) {
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
        {props.text}
      </Typography>
    );
  }

  const starterMessage = (
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

  const errorMessage = (
    <>
      <Message text={"Project not found"} />
    </>
  );

  return (
    <>
      <MainHeader title={project ? project.name : null}>
        {project ? (
          <ProjectOptionsMenu
            projectId={projectId}
            projectSharing={projectSharing}
            projectSharingToggle={projectSharingToggle}
            hideDoneValue={hideDoneTasks}
            hideDoneToggle={toggleHideDoneTasks}
          />
        ) : null}
      </MainHeader>

      <MainBody>
        {!projectId ? (
          <>{starterMessage}</>
        ) : !project ? (
          <>{errorMessage}</>
        ) : (
          <Outlet context={{ hideDoneTasks }} />
        )}
      </MainBody>
    </>
  );
}

function ProjectOptionsMenu(props) {
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

function ProjectSharing(props) {
  const { projectSharing, projectSharingToggle, toggleSidebar } = props;

  const [stopSharingDialogOpen, setStopSharingDialogOpen] = useState(false);
  const stopSharingDialogToggle = () => setStopSharingDialogOpen((x) => !x);

  return (
    <>
      <SidebarHeader title="Project sharing" toggle={toggleSidebar}>
        <Switch
          checked={projectSharing}
          onChange={
            projectSharing ? stopSharingDialogToggle : projectSharingToggle
          }
          sx={{
            padding: 0,
            "& .MuiSwitch-thumb": {
              fontFamily: "Roboto, sans-serif",
              fontSize: "0.9rem",
              borderRadius: "7px",
              height: "32px",
              width: "32px",
              display: "grid",
              placeContent: "center",
              "&:before": {
                content: "'Off'",
                color: "black",
              },
            },
            "& .MuiSwitch-switchBase": {
              padding: "3px",
              "&.Mui-checked": {
                "& .MuiSwitch-thumb:before": {
                  content: "'On'",
                  color: "white",
                },
              },
            },
          }}
        />
      </SidebarHeader>

      <SidebarBody>
        {!projectSharing ? (
          <Typography
            variant="h5"
            align="center"
            sx={{ marginTop: "1rem", fontWeight: "fontWeightLight" }}
          >
            Sharing is Off
          </Typography>
        ) : (
          <Typography>Sharing is on</Typography>
        )}
      </SidebarBody>

      <StopSharingDialog
        open={stopSharingDialogOpen}
        onClose={stopSharingDialogToggle}
        onConfirm={projectSharingToggle}
      />
    </>
  );
}

function StopSharingDialog(props) {
  const { open, onClose, onConfirm } = props;

  function handleConfirm() {
    onConfirm();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Stop sharing project?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          It will do something unreversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color="error">
          Stop sharing
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

function ProjectRenameModal(props) {
  const { open, toggle, projectId } = props;
  const handleClose = () => toggle();

  const project = useSelector(selectProjectById(projectId));
  const dispatch = useDispatch();

  const [renameValue, setRenameValue] = useState(project.name);
  const handleRenameChange = (e) => setRenameValue(e.target.value);

  useEffect(() => {
    setRenameValue(project.name);
  }, [projectId]);

  function handleRename(e) {
    e.preventDefault();
    api.projects
      .update(projectId, { name: renameValue })
      .then((res) => {
        dispatch(updateProject(res));
        handleClose();
      })
      .catch((err) => console.log("Failed to rename project: ", err));
  }

  return (
    <Dialog open={open} onClose={handleClose}>
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
}

function ProjectDeleteModal(props) {
  const { open, toggle, projectId } = props;
  const handleClose = () => toggle();
  const navigate = useNavigate();

  const project = useSelector(selectProjectById(projectId));
  const dispatch = useDispatch();

  // const { handleProjects } = useProjects();

  function handleDelete() {
    api.projects
      .delete(projectId)
      .then((res) => {
        handleClose();
        navigate("/project/");
        dispatch(deleteProject(projectId));
        // setTimeout(() => dispatch(deleteProject(projectId)), 500); -- Redux updates quicker than ReactRouter
      })
      .catch((err) => console.log("Failed to delete project: ", err));
  }

  return (
    <Dialog open={open} onClose={handleClose}>
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
}
