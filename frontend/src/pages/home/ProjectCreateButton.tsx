import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { ErrorAlert } from "~/layout/Alert";
import { InputModal } from "~/layout/Modal";

export const ProjectCreateButton: FC<{ drawerToggle: () => void }> = ({
  drawerToggle,
}) => {
  const actions = useActions();
  const navigate = useNavigate();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const toggleCreateDialog = () => {
    setCreateDialogOpen(!createDialogOpen);
  };

  const [nameValue, setNameValue] = useState("");
  const handleNameChange = (v: string) => {
    setNameValue(v);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateProject() {
    setLoading(true);
    try {
      const newProjectId = await actions.project.create(nameValue);
      setLoading(false);
      toggleCreateDialog();
      drawerToggle();
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
        onConfirm={() => void handleCreateProject()}
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
        toggle={() => {
          setError(null);
        }}
        message={error}
      />
    </List>
  );
};
