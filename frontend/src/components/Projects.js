import React, { useId, useState } from "react";
import Project from "./Project";

import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListIcon from "@mui/icons-material/List";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function ProjectEditDialog(props) {
  const { open, onClose, project } = props;

  const handleClose = () => {
    onClose();
  };

  const handleRename = (id, name) => {
    console.log(id, name);
    onClose();
  };

  const handleDelete = (id) => {
    console.log(id);
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
        <h4>Edit project</h4>

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
            value={project.name}
          />
          <Button type="submit">Rename</Button>
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

export default function Projects(props) {
  const newListInput = useId();
  const [newTasklistName, setNewTasklistName] = useState("");
  const newTasklistNameChange = (e) => setNewTasklistName(e.target.value);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
  };
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  return (
    <>
      <List>
        {props.projects.map((item) => (
          <ListItem
            key={"pj-" + item.id}
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
        ))}
      </List>

      <Divider />

      {props.projectSelected && (
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
              props.projects.filter(
                (item) => item.id === props.projectSelected
              )[0]
            }
          />

          <Divider />
        </>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "0.5rem",
        }}
      >
        <Button variant="outlined">Add new</Button>
      </div>
      <Divider />

      <div style={{ padding: "0.5rem" }}>
        <form>
          <input
            id={newListInput}
            type={"text"}
            value={newTasklistName}
            onChange={newTasklistNameChange}
            placeholder={"New list"}
          ></input>
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

        {props.projects?.map((item) => {
          return (
            <Project
              key={"project-" + item.id}
              item={item}
              selected={props.projectSelected === item.id}
              handleProjects={props.handleProjects}
              onProjectSelect={props.onProjectSelect}
            />
          );
        })}
      </div>
    </>
  );
}
