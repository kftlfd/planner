import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useActions } from "~/context/ActionsContext";
import { ErrorAlert } from "~/layout/Alert";
import { InputModal } from "~/layout/Modal";
import {
  selectProjectById,
  selectSharedProjectIds,
} from "~/store/projectsSlice";

import { MenuListItem } from "./ProjectOprionsMenu";

export const ProjectRename: FC<{
  closeOptionsMenu: () => void;
}> = ({ closeOptionsMenu }) => {
  const params = useParams();
  const projectId = Number(params.projectId);
  const project = useSelector(selectProjectById(projectId));
  const sharedIds = useSelector(selectSharedProjectIds);
  const actions = useActions();

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const toggleRenameDialog = () => {
    closeOptionsMenu();
    setRenameDialogOpen((x) => !x);
  };

  const [renameValue, setRenameValue] = useState(project?.name ?? "");
  const handleRenameChange = (v: string) => {
    setRenameValue(v);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRename = async () => {
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
  };

  if (sharedIds.includes(Number(projectId))) return null;

  return (
    <>
      <MenuListItem onClick={toggleRenameDialog}>Rename</MenuListItem>

      <InputModal
        open={renameDialogOpen}
        onConfirm={() => void handleRename()}
        onClose={toggleRenameDialog}
        title={`Rename project "${project?.name}"`}
        action={"Rename"}
        inputValue={renameValue}
        inputChange={handleRenameChange}
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
