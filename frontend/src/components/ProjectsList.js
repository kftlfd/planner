import React, { useEffect, useId, useState } from "react";
import { NavLink } from "react-router-dom";
import Project from "./Deprecated_Project";

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
  const { open, onClose, project, handleProjects } = props;

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
            handleRename(project.id, event.target.name.value);
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
            handleDelete(project.id);
          }}
        >
          <Button type="submit">Delete</Button>
        </form>
      </div>
    </Dialog>
  );
}

export default function ProjectsList(props) {
  const newListInput = useId();
  const [newTasklistName, setNewTasklistName] = useState("");
  const newTasklistNameChange = (e) => setNewTasklistName(e.target.value);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const handleEditDialogOpen = () => setEditDialogOpen(true);
  const handleEditDialogClose = () => setEditDialogOpen(false);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const handleCreateDialogOpen = () => setCreateDialogOpen(true);
  const handleCreateDialogClose = () => setCreateDialogOpen(false);

  const projectsList = (
    <List>
      {props.projects.map((item) => (
        <NavLink to={`project/${item.id}`} key={"pj-" + item.id}>
          <ListItem
            onClick={() => props.onProjectSelect(item.id)}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText>{item.name}</ListItemText>
            </ListItemButton>
          </ListItem>
        </NavLink>
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
        project={
          props.projects.filter((item) => item.id === props.projectSelected)[0]
        }
        handleProjects={props.handleProjects}
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
        handleProjects={props.handleProjects}
      />
    </>
  );

  const deprecatedProjectsList = (
    <div style={{ padding: "0.5rem" }}>
      <form>
        <input
          id={newListInput}
          type={"text"}
          value={newTasklistName}
          onChange={newTasklistNameChange}
          placeholder={"New list"}
        />
        <button
          onClick={(event) => {
            event.preventDefault();
            let name = document.getElementById(newListInput).value;
            props.handleProjects.create(name);
          }}
          disabled={!newTasklistName}
        >
          + Add new
        </button>
      </form>

      {props.projects?.map((item) => (
        <Project
          key={"project-" + item.id}
          item={item}
          selected={props.projectSelected === item.id}
          handleProjects={props.handleProjects}
          onProjectSelect={props.onProjectSelect}
        />
      ))}
    </div>
  );

  return (
    <>
      {projectsList}
      <Divider />
      {props.projectSelected && (
        <>
          {projectEditButton}
          <Divider />
        </>
      )}
      {projectAddButton}
    </>
  );
}
