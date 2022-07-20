import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { deleteProject, selectProjectById } from "../../store/projectsSlice";

import { MenuListItem } from "./ProjectOprionsMenu";
import { ProjectDeleteModal } from "./ProjectModals";

export function ProjectDelete(props) {
  const { closeOptionsMenu } = props;
  const { projectId } = useParams();
  const navigate = useNavigate();

  const project = useSelector(selectProjectById(projectId));
  const dispatch = useDispatch();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const toggleDeleteDialog = () => {
    if (!deleteDialogOpen) closeOptionsMenu();
    setDeleteDialogOpen((x) => !x);
  };

  function handleDelete() {
    api.projects
      .delete(projectId)
      .then((res) => {
        toggleDeleteDialog();
        navigate("/project/");
        // setting delay to prevent flashing 'Project not found message',
        // since project gets deleted before app navigates to "/project/"
        setTimeout(() => dispatch(deleteProject(projectId)), 200);
      })
      .catch((err) => console.log("Failed to delete project: ", err));
  }

  return (
    <>
      <MenuListItem onClick={toggleDeleteDialog}>Delete</MenuListItem>

      <ProjectDeleteModal
        open={deleteDialogOpen}
        onClose={toggleDeleteDialog}
        onConfirm={handleDelete}
        name={project.name}
      />
    </>
  );
}
