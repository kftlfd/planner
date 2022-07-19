import React, { useState } from "react";
import { useParams, Outlet } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { selectProjectById, updateProject } from "../../store/projectsSlice";

import * as api from "../../api/client";

import { ProjectOptionsMenu } from "./ProjectOprionsMenu";

import { MainHeader, MainBody } from "../../layout/Main";

import { Typography, Box, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function Project(props) {
  const { projectId } = useParams();
  const project = useSelector(selectProjectById(projectId));
  const dispatch = useDispatch();

  const [hideDoneTasks, setHideDoneTasks] = useState(false);
  const toggleHideDoneTasks = () => setHideDoneTasks((x) => !x);

  const [projectSharing, setProjectSharing] = useState(false);
  const projectSharingToggle = () => {
    if (projectSharing) {
      api.projects.sharing
        .disable(projectId)
        .then((res) => {
          dispatch(updateProject(res));
        })
        .catch((err) => console.error("Failed to stop sharing: ", err));
    } else {
      api.projects.sharing
        .enable(projectId)
        .then((res) => {
          dispatch(updateProject(res));
        })
        .catch((err) => console.error("Failed to start sharing: ", err));
    }
    setProjectSharing(!projectSharing);
  };

  React.useEffect(() => {
    if (project) {
      setProjectSharing(project.sharing);
    }
  }, [project]);

  const starterMessage = (
    <>
      <Message text={"Select a project"} />
      <Box
        sx={{
          marginTop: "5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "fontWeightLight",
            color: "text.primary",
          }}
        >
          or
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "fontWeightLight",
            color: "text.primary",
          }}
        >
          Create New Project
        </Typography>
        <IconButton
          onClick={() =>
            document.getElementById("create-new-project-button").click()
          }
          sx={{
            svg: {
              fontSize: "10rem",
            },
          }}
        >
          <AddCircleIcon />
        </IconButton>
      </Box>
    </>
  );

  const errorMessage = (
    <>
      <Message text={"Project not found"} />
    </>
  );

  return (
    <>
      <MainHeader title={project ? project.name : null}>
        {project ? (
          <ProjectOptionsMenu
            projectId={projectId}
            projectSharing={projectSharing}
            projectSharingToggle={projectSharingToggle}
            hideDoneValue={hideDoneTasks}
            hideDoneToggle={toggleHideDoneTasks}
          />
        ) : null}
      </MainHeader>

      <MainBody>
        {!projectId ? (
          <>{starterMessage}</>
        ) : !project ? (
          <>{errorMessage}</>
        ) : (
          <Outlet context={{ hideDoneTasks }} />
        )}
      </MainBody>
    </>
  );
}

function Message(props) {
  return (
    <Typography
      variant="h4"
      align="center"
      sx={{
        marginTop: "3rem",
        fontWeight: "fontWeightLight",
        color: "text.primary",
      }}
    >
      {props.text}
    </Typography>
  );
}
