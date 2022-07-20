import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { updateProject, selectProjectById } from "../../store/projectsSlice";

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

export function ProjectStopSharingModal(props) {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Stop sharing project?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          It will do something unreversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onConfirm} color="error">
          Stop sharing
        </Button>
        <Button onClick={props.onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export function ProjectRenameModal(props) {
  const { open, toggle } = props;
  const { projectId } = useParams();
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
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Delete project "{props.name}"?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This action cannot be undone, all tasks in project will be deleted
          too.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onConfirm} color={"error"}>
          Delete
        </Button>
        <Button onClick={props.onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
