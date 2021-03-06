import React, { useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useProjects } from "../ProjectsContext";
import { MainHeader, MainBody, MainSidebar, MainSidebarHeader } from "./Main";

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
  const { projects } = useProjects();
  const { projectId } = useParams();
  const validProject = projectId && projects[projectId];

  const [projectSharing, setProjectSharing] = useState(false);
  const projectSharingToggle = () => setProjectSharing((x) => !x);

  const [hideDoneTasks, setHideDoneTasks] = useState(false);
  const toggleHideDoneTasks = () => setHideDoneTasks((x) => !x);

  const starterMessage = (
    <>
      <Toolbar />
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
      <Toolbar />
      <Message text={"Project not found"} />
    </>
  );

  return (
    <>
      <MainHeader title={validProject ? projects[projectId].name : "Project"}>
        {validProject ? (
          <ProjectOptionsMenu
            project={projects[projectId]}
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
        ) : !projects[projectId] ? (
          <>{errorMessage}</>
        ) : (
          <Outlet context={{ hideDoneTasks }} />
        )}
      </MainBody>
    </>
  );
}

function ProjectOptionsMenu(props) {
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
          onClick={props.hideDoneToggle}
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
            <Switch checked={props.hideDoneValue} />
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={toggleSidebar}
          sx={{ justifyContent: "space-between" }}
        >
          Project sharing
          <Checkbox color="success" checked={props.projectSharing} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={toggleRenameDialog}>Rename</MenuItem>
        <Divider />
        <MenuItem onClick={toggleDeleteDialog}>Delete</MenuItem>
      </Menu>

      <MainSidebar
        open={sidebarOpen}
        toggle={toggleSidebar}
        title={"Project sharing"}
        children={
          <ProjectSharing
            projectSharing={props.projectSharing}
            projectSharingToggle={props.projectSharingToggle}
            toggleSidebar={toggleSidebar}
          />
        }
      />
      <ProjectRenameModal
        open={renameDialogOpen}
        toggle={toggleRenameDialog}
        project={props.project}
      />
      <ProjectDeleteModal
        open={deleteDialogOpen}
        toggle={toggleDeleteDialog}
        project={props.project}
      />
    </>
  );
}

function ProjectRenameModal(props) {
  const { handleProjects } = useProjects();
  const handleClose = () => props.toggle();

  const handleRename = async (e) => {
    e.preventDefault();
    await handleProjects.update(props.project.id, { name: renameValue });
    handleClose();
  };

  const [renameValue, setRenameValue] = useState(props.project.name);
  const handleRenameChange = (e) => setRenameValue(e.target.value);

  return (
    <Dialog open={props.open} onClose={handleClose}>
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
  const { handleProjects } = useProjects();
  const handleClose = () => props.toggle();
  const navigate = useNavigate();

  const handleDelete = async () => {
    await handleProjects.delete(props.project.id);
    handleClose();
    navigate("/project/");
  };

  return (
    <Dialog open={props.open} onClose={handleClose}>
      <DialogTitle>Delete project "{props.project.name}"?</DialogTitle>
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

function ProjectSharing(props) {
  const { projectSharing, projectSharingToggle } = props;

  const [stopSharingDialogOpen, setStopSharingDialogOpen] = useState(false);
  const stopSharingDialogToggle = () => setStopSharingDialogOpen((x) => !x);

  function StopSharingDialog(props) {
    function handleConfirm() {
      props.onConfirm();
      props.onClose();
    }
    return (
      <Dialog open={props.open} onClose={props.onClose}>
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
          <Button onClick={props.onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <>
      <MainSidebarHeader title="Project sharing" toggle={props.toggleSidebar}>
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
      </MainSidebarHeader>

      <Toolbar />

      <Box sx={{ padding: "2rem" }}>
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
      </Box>

      <StopSharingDialog
        open={stopSharingDialogOpen}
        onClose={stopSharingDialogToggle}
        onConfirm={projectSharingToggle}
      />
    </>
  );
}
