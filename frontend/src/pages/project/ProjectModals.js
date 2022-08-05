/* @deprecated */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useActions } from "../../context/ActionsContext";
import { selectProjectById } from "../../store/projectsSlice";

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

/* @deprecated */
export function ProjectRenameModal(props) {
  const { open, toggle } = props;
  const { projectId } = useParams();
  const actions = useActions();

  const handleClose = () => toggle();

  const project = useSelector(selectProjectById(projectId));

  const [renameValue, setRenameValue] = useState(project.name);
  const handleRenameChange = (e) => setRenameValue(e.target.value);

  useEffect(() => {
    setRenameValue(project.name);
  }, [projectId]);

  async function handleRename(e) {
    e.preventDefault();
    try {
      await actions.project.update(projectId, { name: renameValue });
      handleClose();
    } catch (error) {
      console.error("Failed to rename project: ", error);
    }
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
