import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectSharedProjectIds } from "../../store/projectsSlice";
import { MenuListItem } from "./ProjectOprionsMenu";
import { ProjectRenameModal } from "./ProjectModals";

export function ProjectRename(props) {
  const { closeOptionsMenu } = props;
  const { projectId } = useParams();

  const sharedIds = useSelector(selectSharedProjectIds);
  const isShared = sharedIds.includes(Number(projectId));

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const toggleRenameDialog = () => {
    closeOptionsMenu();
    setRenameDialogOpen((x) => !x);
  };

  if (isShared) return null;

  return (
    <>
      <MenuListItem onClick={toggleRenameDialog}>Rename</MenuListItem>

      <ProjectRenameModal open={renameDialogOpen} toggle={toggleRenameDialog} />
    </>
  );
}
