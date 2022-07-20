import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { addProject } from "../../store/projectsSlice";
import { loadTasks } from "../../store/tasksSlice";

import * as api from "../../api/client";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export function ProjectCreateButton(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const toggleCreateDialog = () => setCreateDialogOpen(!createDialogOpen);

  const [nameValue, setNameValue] = useState("");
  const handleNameChange = (e) => setNameValue(e.target.value);

  const handleCreateProject = async (event) => {
    event.preventDefault();
    try {
      const newProject = await api.projects.create(nameValue);
      dispatch(addProject(newProject));
      dispatch(loadTasks({ tasks: {}, projectId: newProject.id, ids: [] }));
      navigate(`/project/${newProject.id}`);
    } catch (error) {
      console.error(error);
    }
    toggleCreateDialog();
  };

  return (
    <List>
      <ListItemButton
        id={"create-new-project-button"}
        onClick={toggleCreateDialog}
      >
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText>Create new project</ListItemText>
      </ListItemButton>

      <Dialog open={createDialogOpen} onClose={toggleCreateDialog}>
        <DialogTitle>Create new project</DialogTitle>
        <form onSubmit={handleCreateProject}>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              type="text"
              name="name"
              placeholder="Project Name"
              value={nameValue}
              onChange={handleNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit" disabled={!nameValue}>
              Create
            </Button>
            <Button onClick={toggleCreateDialog}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </List>
  );
}
