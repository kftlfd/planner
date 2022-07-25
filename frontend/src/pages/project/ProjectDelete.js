import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useActions } from "../../context/ActionsContext";
import {
  selectProjectById,
  selectSharedProjectIds,
} from "../../store/projectsSlice";
import { MenuListItem } from "./ProjectOprionsMenu";
import { SimpleModal } from "../../layout/Modal";

export function ProjectDelete(props) {
  const { closeOptionsMenu } = props;
  const { projectId } = useParams();
  const actions = useActions();

  const project = useSelector(selectProjectById(projectId));
  const sharedIds = useSelector(selectSharedProjectIds);
  const isShared = sharedIds.includes(Number(projectId));

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const toggleDeleteDialog = () => {
    if (!deleteDialogOpen) closeOptionsMenu();
    setDeleteDialogOpen((x) => !x);
  };

  async function handleDelete() {
    try {
      await actions.project.delete(projectId);
    } catch (error) {
      console.log("Failed to delete project: ", error);
    }
  }

  if (isShared) return null;

  return (
    <>
      <MenuListItem onClick={toggleDeleteDialog}>Delete</MenuListItem>

      <SimpleModal
        open={deleteDialogOpen}
        onClose={toggleDeleteDialog}
        onConfirm={handleDelete}
        title={`Delete project "${project.name}"?`}
        content={
          "This action cannot be undone, all tasks in project will be deleted too."
        }
        action={"Delete"}
      />
    </>
  );
}
