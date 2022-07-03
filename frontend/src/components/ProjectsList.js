import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjects } from "../ProjectsContext";

import {
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import AddIcon from "@mui/icons-material/Add";

const ProjectsList = (props) => (
  <List subheader={<ListSubheader component="div">Projects</ListSubheader>}>
    <ProjectsButtons />
    <ProjectCreateButton />
  </List>
);

const ProjectsButtons = (props) => {
  const { projectId } = useParams();
  const { projects } = useProjects();
  const navigate = useNavigate();

  return (
    <>
      {Object.keys(projects).map((id) => (
        <ListItemButton
          key={"pj-" + id}
          selected={projectId === id}
          onClick={projectId === id ? null : () => navigate(`project/${id}`)}
        >
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary={projects[id].name} />
        </ListItemButton>
      ))}
    </>
  );
};

const ProjectCreateButton = (props) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const toggleCreateDialog = () => setCreateDialogOpen(!createDialogOpen);

  return (
    <>
      <ListItemButton onClick={toggleCreateDialog} sx={{ marginTop: "0.5rem" }}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText>Create new project</ListItemText>
      </ListItemButton>

      <ProjectCreateDialog
        open={createDialogOpen}
        toggle={toggleCreateDialog}
      />
    </>
  );
};

const ProjectCreateDialog = (props) => {
  const { handleProjects } = useProjects();
  const handleClose = () => props.toggle();

  const [nameValue, setNameValue] = useState("");
  const handleNameChange = (e) => setNameValue(e.target.value);

  const handleCreate = async (event) => {
    event.preventDefault();
    await handleProjects.create(nameValue);
    handleClose();
  };

  return (
    <Dialog open={props.open} onClose={handleClose}>
      <DialogTitle>Create new project</DialogTitle>
      <form onSubmit={handleCreate}>
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
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectsList;
