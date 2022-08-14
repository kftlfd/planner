import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { ErrorAlert } from "../../layout/Alert";

import {
  selectProjectById,
  selectSharedProjectIds,
} from "../../store/projectsSlice";
import { useActions } from "../../context/ActionsContext";
import { MenuListItem } from "./ProjectOprionsMenu";
import { InputModal } from "../../layout/Modal";

export function ProjectRename(props) {
  const { closeOptionsMenu } = props;
  const { projectId } = useParams();
  const project = useSelector(selectProjectById(projectId));
  const sharedIds = useSelector(selectSharedProjectIds);
  const actions = useActions();

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const toggleRenameDialog = () => {
    closeOptionsMenu();
    setRenameDialogOpen((x) => !x);
  };

  const [renameValue, setRenameValue] = useState(project.name);
  const handleRenameChange = (e) => setRenameValue(e.target.value);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleRename() {
    setLoading(true);
    try {
      await actions.project.update(projectId, { name: renameValue });
      toggleRenameDialog();
      setLoading(false);
    } catch (error) {
      console.error("Failed to rename project: ", error);
      setLoading(false);
      setError("Can't rename project");
    }
  }

  if (sharedIds.includes(Number(projectId))) return null;

  return (
    <>
      <MenuListItem onClick={toggleRenameDialog}>Rename</MenuListItem>

      <InputModal
        open={renameDialogOpen}
        onConfirm={handleRename}
        onClose={toggleRenameDialog}
        title={`Rename project "${project.name}"`}
        action={"Rename"}
        inputValue={renameValue}
        inputChange={handleRenameChange}
        loading={loading}
      />

      <ErrorAlert
        open={error !== null}
        toggle={() => setError(null)}
        message={error}
      />
    </>
  );
}
