import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

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

  async function handleRename() {
    try {
      await actions.project.update(projectId, { name: renameValue });
      toggleRenameDialog();
    } catch (error) {
      console.error("Failed to rename project: ", error);
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
      />
    </>
  );
}
