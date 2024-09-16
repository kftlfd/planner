import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useActions } from "~/context/ActionsContext";
import { ErrorAlert } from "~/layout/Alert";
import { SimpleModal } from "~/layout/Modal";
import {
  selectProjectById,
  selectSharedProjectIds,
} from "~/store/projectsSlice";

import { MenuListItem } from "./ProjectOprionsMenu";

export const ProjectDelete: FC<{
  closeOptionsMenu: () => void;
}> = ({ closeOptionsMenu }) => {
  const params = useParams<{ projectId: string }>();
  const projectId = Number(params.projectId);
  const actions = useActions();

  const project = useSelector(selectProjectById(projectId));
  const sharedIds = useSelector(selectSharedProjectIds);
  const isShared = sharedIds.includes(projectId);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const toggleDeleteDialog = () => {
    if (!deleteDialogOpen) closeOptionsMenu();
    setDeleteDialogOpen((x) => !x);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!project) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await actions.project.delete(projectId);
      setLoading(false);
    } catch (error) {
      console.error("Failed to delete project: ", error);
      setLoading(false);
      setError("Can't delete project");
    }
  };

  if (isShared) return null;

  return (
    <>
      <MenuListItem onClick={toggleDeleteDialog}>Delete</MenuListItem>

      <SimpleModal
        open={deleteDialogOpen}
        onClose={toggleDeleteDialog}
        onConfirm={() => void handleDelete()}
        title={`Delete project "${project.name}"?`}
        content={
          "This action cannot be undone, all tasks in project will be deleted too."
        }
        action={"Delete"}
        loading={loading}
      />

      <ErrorAlert
        open={error !== null}
        toggle={() => {
          setError(null);
        }}
        message={error}
      />
    </>
  );
};
