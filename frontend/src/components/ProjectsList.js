import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjects } from "../ProjectsContext";

import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListIcon from "@mui/icons-material/List";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function ProjectCreateDialog(props) {
  const { open, onClose, handleProjects } = props;

  const [nameValue, setNameValue] = useState("");
  const handleNameChange = (e) => setNameValue(e.target.value);

  const handleClose = () => onClose();

  const handleCreate = async (name) => {
    await handleProjects.create(name);
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <div
        style={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <DialogTitle>Add new project</DialogTitle>

        <form
          name="create"
          onSubmit={(event) => {
            event.preventDefault();
            handleCreate(event.target.name.value);
          }}
        >
          <TextField
            type="text"
            name="name"
            label="Name"
            value={nameValue}
            onChange={handleNameChange}
          />
          <Button type="submit" disabled={!nameValue}>
            Create
          </Button>
        </form>
      </div>
    </Dialog>
  );
}

function ProjectEditDialog(props) {
  const { open, onClose, project, projectId, handleProjects } = props;
  const navigate = useNavigate();

  const [renameValue, setRenameValue] = useState("");
  const handleRenameChange = (e) => setRenameValue(e.target.value);

  useEffect(() => {
    if (project) setRenameValue(project.name);
  }, [project]);

  const handleClose = () => onClose();

  const handleRename = async (id, name) => {
    await handleProjects.update(id, { name: name });
    onClose();
  };

  const handleDelete = async (id) => {
    await handleProjects.delete(id);
    onClose();
    navigate("/project/");
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <div
        style={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <DialogTitle>Edit project: {project.name}</DialogTitle>

        <form
          name="rename"
          onSubmit={(event) => {
            event.preventDefault();
            handleRename(projectId, event.target.name.value);
          }}
        >
          <TextField
            type="text"
            name="name"
            label="Name"
            value={renameValue}
            onChange={handleRenameChange}
          />
          <Button type="submit" disabled={!renameValue}>
            Rename
          </Button>
        </form>

        <form
          name="delete"
          onSubmit={(event) => {
            event.preventDefault();
            handleDelete(projectId);
          }}
        >
          <Button type="submit">Delete</Button>
        </form>
      </div>
    </Dialog>
  );
}

export default function ProjectsList(props) {
  const { projects, handleProjects } = useProjects();
  const navigate = useNavigate();
  const params = useParams();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const handleEditDialogOpen = () => setEditDialogOpen(true);
  const handleEditDialogClose = () => setEditDialogOpen(false);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const handleCreateDialogOpen = () => setCreateDialogOpen(true);
  const handleCreateDialogClose = () => setCreateDialogOpen(false);

  const projectsList = (
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

  const projectEditButton = (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "0.5rem",
        }}
      >
        <Button variant="outlined" onClick={handleEditDialogOpen}>
          Edit
        </Button>
      </div>

      <ProjectEditDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        project={projects[Number(params.projectId)]}
        projectId={Number(params.projectId)}
        handleProjects={handleProjects}
      />
    </>
  );

  const projectAddButton = (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "0.5rem",
        }}
      >
        <Button variant="outlined" onClick={handleCreateDialogOpen}>
          Add new
        </Button>
      </div>

      <ProjectCreateDialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        handleProjects={handleProjects}
      />
    </>
  );

  return (
    <>
      {projectsList}
      <Divider />
      {params.projectId && projects[Number(params.projectId)] && (
        <>
          {projectEditButton}
          <Divider />
        </>
      )}
      {projectAddButton}
    </>
  );
}
