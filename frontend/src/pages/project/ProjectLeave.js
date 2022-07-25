import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useActions } from "../../context/ActionsContext";
import {
  selectProjectById,
  selectSharedProjectIds,
} from "../../store/projectsSlice";
import { SimpleModal } from "../../layout/Modal";
import { MenuListItem } from "./ProjectOprionsMenu";

export function ProjectLeave(props) {
  const { closeOptionsMenu } = props;
  const { projectId } = useParams();
  const actions = useActions();

  const project = useSelector(selectProjectById(projectId));
  const sharedIds = useSelector(selectSharedProjectIds);
  const isShared = sharedIds.includes(Number(projectId));

  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const toggleLeaveDialog = () => {
    if (!leaveDialogOpen) closeOptionsMenu();
    setLeaveDialogOpen((x) => !x);
  };

  async function handleLeave() {
    try {
      await actions.project.leave(projectId);
    } catch (error) {
      console.error("Failed to leave project: ", error);
    }
  }

  if (!isShared) return null;

  return (
    <>
      <MenuListItem onClick={toggleLeaveDialog}>Leave</MenuListItem>

      <SimpleModal
        open={leaveDialogOpen}
        onClose={toggleLeaveDialog}
        onConfirm={handleLeave}
        title={`Leave project "${project.name}"?`}
        content={"Are you sure?"}
        action={"Leave"}
      />
    </>
  );
}
