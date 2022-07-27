import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectProjectById } from "../../store/projectsSlice";

import {
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import PeopleIcon from "@mui/icons-material/People";

export function ProjectsButtons(props) {
  const { header, projectIds, drawerToggle } = props;
  const { projectId } = useParams();

  return (
    <List
      subheader={
        <ListSubheader component={"div"} sx={{ background: "inherit" }}>
          {header}
        </ListSubheader>
      }
      sx={{ background: "inherit" }}
    >
      {projectIds.map((id) => (
        <ProjectButton
          key={"pb-" + id}
          projectId={id}
          selected={projectId === id}
          drawerToggle={drawerToggle}
        />
      ))}
    </List>
  );
}

function ProjectButton(props) {
  const { projectId, selected, drawerToggle } = props;
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
        {project.sharing ? <PeopleIcon /> : <ListIcon />}
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
