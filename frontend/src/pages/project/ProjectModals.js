import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import {
  updateProject,
  deleteProject,
  selectProjectById,
} from "../../store/projectsSlice";

import * as api from "../../api/client";

import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function ProjectRenameModal(props) {
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

export function ProjectDeleteModal(props) {
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
