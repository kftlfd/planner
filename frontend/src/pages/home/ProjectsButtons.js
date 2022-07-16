import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectProjectIds, selectProjectById } from "../../store/projectsSlice";

import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import ListIcon from "@mui/icons-material/List";

export function ProjectsButtons(props) {
  const { projectId } = useParams();
  const projectIds = useSelector(selectProjectIds);

  return (
    <>
      {projectIds.map((id) => (
        <ProjectButton
          key={"pb-" + id}
          projectId={id}
          selected={projectId === id}
          drawerToggle={props.drawerToggle}
        />
      ))}
    </>
  );
}

function ProjectButton({ projectId, selected, drawerToggle }) {
  const navigate = useNavigate();
  const project = useSelector(selectProjectById(projectId));

  return (
    <ListItemButton
      selected={selected}
      onClick={
        selected
          ? () => drawerToggle()
          : () => {
              navigate(`project/${project.id}`);
              drawerToggle();
            }
      }
    >
      <ListItemIcon>
        <ListIcon />
      </ListItemIcon>
      <ListItemText
        primary={project.name}
        sx={{
          span: {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        }}
      />
    </ListItemButton>
  );
}
