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

export default function ProjectsList(props) {
  const { projects, handleProjects } = useProjects();
  const navigate = useNavigate();
  const params = useParams();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const toggleCreateDialog = () => setCreateDialogOpen(!createDialogOpen);

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

  return (
    <>
      <List subheader={<ListSubheader component="div">Projects</ListSubheader>}>
        {Object.keys(projects).map((id) => (
          <ListItemButton
            key={"pj-" + id}
            onClick={() => navigate(`project/${id}`)}
            selected={params.projectId === id}
          >
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText>{projects[id].name}</ListItemText>
          </ListItemButton>
        ))}

        <ListItemButton
          onClick={toggleCreateDialog}
          sx={{ marginTop: "0.5rem" }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText>Create new project</ListItemText>
        </ListItemButton>
      </List>

      <ProjectCreateDialog />
    </>
  );
}
