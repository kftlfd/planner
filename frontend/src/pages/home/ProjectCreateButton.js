import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useActions } from "../../context/ActionsContext";
import { InputModal } from "../../layout/Modal";

import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export function ProjectCreateButton(props) {
  const actions = useActions();
  const navigate = useNavigate();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const toggleCreateDialog = () => setCreateDialogOpen(!createDialogOpen);

  const [nameValue, setNameValue] = useState("");
  const handleNameChange = (e) => setNameValue(e.target.value);

  async function handleCreateProject(event) {
    event.preventDefault();
    try {
      const newProjectId = await actions.project.create(nameValue);
      navigate(`/project/${newProjectId}`);
      toggleCreateDialog();
    } catch (error) {
      console.error("Failed to create project: ", error);
    }
  }

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

      <InputModal
        open={createDialogOpen}
        onConfirm={handleCreateProject}
        onClose={toggleCreateDialog}
        title={"Create new project"}
        action={"Create"}
        inputLabel={"Project Name"}
        inputValue={nameValue}
        inputChange={handleNameChange}
      />
    </List>
  );
}
