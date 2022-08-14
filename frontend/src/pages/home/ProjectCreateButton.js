import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useActions } from "../../context/ActionsContext";
import { InputModal } from "../../layout/Modal";
import { ErrorAlert } from "../../layout/Alert";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleCreateProject() {
    setLoading(true);
    try {
      const newProjectId = await actions.project.create(nameValue);
      setLoading(false);
      toggleCreateDialog();
      props.drawerToggle();
      setNameValue("");
      navigate(`/project/${newProjectId}`);
    } catch (error) {
      setLoading(false);
      console.error("Failed to create project: ", error);
      setError("Can't create project");
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
        loading={loading}
      />

      <ErrorAlert
        open={error !== null}
        toggle={() => setError(null)}
        message={error}
      />
    </List>
  );
}
