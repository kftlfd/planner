import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useActions } from "~/context/ActionsContext";
import { SimpleModal } from "~/layout/Modal";
import {
  selectProjectById,
  selectSharedProjectIds,
} from "~/store/projectsSlice";

import { MenuListItem } from "./ProjectOprionsMenu";

export const ProjectLeave: FC<{
  closeOptionsMenu: () => void;
}> = ({ closeOptionsMenu }) => {
  const params = useParams<{ projectId: string }>();
  const projectId = Number(params.projectId);
  const actions = useActions();

  const project = useSelector(selectProjectById(projectId));
  const sharedIds = useSelector(selectSharedProjectIds);
  const isShared = sharedIds.includes(projectId);

  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const toggleLeaveDialog = () => {
    if (!leaveDialogOpen) closeOptionsMenu();
    setLeaveDialogOpen((x) => !x);
  };

  if (!project) return null;

  const handleLeave = async () => {
    try {
      await actions.project.leave(projectId);
    } catch (error) {
      console.error("Failed to leave project: ", error);
    }
  };

  if (!isShared) return null;

  return (
    <>
      <MenuListItem onClick={toggleLeaveDialog}>Leave</MenuListItem>

      <SimpleModal
        open={leaveDialogOpen}
        onClose={toggleLeaveDialog}
        onConfirm={() => void handleLeave()}
        title={`Leave project "${project.name}"?`}
        content={"Are you sure?"}
        action={"Leave"}
      />
    </>
  );
};
