import React, { useState } from "react";

import { MenuListItem } from "./ProjectOprionsMenu";
import { ProjectRenameModal } from "./ProjectModals";

export function ProjectRename(props) {
  const { closeOptionsMenu } = props;
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const toggleRenameDialog = () => {
    closeOptionsMenu();
    setRenameDialogOpen((x) => !x);
  };

  return (
    <>
      <MenuListItem onClick={toggleRenameDialog}>Rename</MenuListItem>

      <ProjectRenameModal open={renameDialogOpen} toggle={toggleRenameDialog} />
    </>
  );
}
