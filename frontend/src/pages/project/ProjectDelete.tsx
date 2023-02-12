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
import { ErrorAlert } from "../../layout/Alert";

export function ProjectDelete(props: { closeOptionsMenu: () => void }) {
  const { closeOptionsMenu } = props;
  const { projectId } = useParams<{ projectId: string }>();
  const actions = useActions();

  const project = useSelector(selectProjectById(Number(projectId)));
  const sharedIds = useSelector(selectSharedProjectIds);
  const isShared = sharedIds.includes(Number(projectId));

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const toggleDeleteDialog = () => {
    if (!deleteDialogOpen) closeOptionsMenu();
    setDeleteDialogOpen((x) => !x);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    try {
      await actions.project.delete(projectId);
      setLoading(false);
    } catch (error) {
      console.error("Failed to delete project: ", error);
      setLoading(false);
      setError("Can't delete project");
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
