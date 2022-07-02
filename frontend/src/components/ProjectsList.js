import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjects } from "../ProjectsContext";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import AddIcon from "@mui/icons-material/Add";

export default function ProjectsList(props) {
  const { projects, handleProjects } = useProjects();
  const navigate = useNavigate();
  const params = useParams();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const toggleCreateDialog = () => setCreateDialogOpen(!createDialogOpen);

  const ProjectButtons = () => (
    <List>
      {Object.keys(projects).map((id) => (
        <ListItem
          key={"pj-" + id}
          onClick={() => navigate(`project/${id}`)}
          selected={Number(params.projectId) === id}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText>{projects[id].name}</ListItemText>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  const ProjectCreateButton = () => (
    <IconButton
      onClick={toggleCreateDialog}
      size={"large"}
      sx={{ alignSelf: "center" }}
    >
      <AddIcon />
    </IconButton>
  );

  const ProjectCreateDialog = () => {
    const handleClose = () => toggleCreateDialog();

    const [nameValue, setNameValue] = useState("");
    const handleNameChange = (e) => setNameValue(e.target.value);

    const handleCreate = async (event) => {
      event.preventDefault();
      await handleProjects.create(nameValue);
      handleClose();
    };

    return (
      <Dialog open={createDialogOpen} onClose={handleClose}>
        <DialogTitle>Add new project</DialogTitle>
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

  return (
    <>
      <ProjectButtons />
      <ProjectCreateButton />
      <ProjectCreateDialog />
    </>
  );
}
