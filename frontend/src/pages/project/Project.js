import React from "react";
import { useParams, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectProjectView } from "../../store/settingsSlice";
import { selectProjectById } from "../../store/projectsSlice";
import { useActions } from "../../context/ActionsContext";
import { MainHeader, MainBody } from "../../layout/Main";
import { ProjectOptionsMenu } from "./ProjectOprionsMenu";

import {
  Typography,
  Box,
  IconButton,
  ButtonGroup,
  Button,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function Project(props) {
  const { projectId } = useParams();
  const project = useSelector(selectProjectById(projectId));
  const view = useSelector(selectProjectView);
  const actions = useActions();

  function ViewButton(props) {
    const { viewName, icon } = props;
    return (
      <Button
        value={viewName}
        variant={view === viewName ? "contained" : "outlined"}
        onClick={() => actions.settings.setProjectView(viewName)}
      >
        {icon}
      </Button>
    );
  }

  return (
    <>
      <MainHeader title={project ? project.name : null}>
        {project ? (
          <Box sx={{ display: "flex", gap: "1rem", marginLeft: "1rem" }}>
            <ButtonGroup size="small" disableElevation>
              <ViewButton viewName="list" icon={<ViewListIcon />} />
              <ViewButton viewName="board" icon={<ViewColumnIcon />} />
              <ViewButton viewName="calendar" icon={<CalendarMonthIcon />} />
            </ButtonGroup>
            <ProjectOptionsMenu />
          </Box>
        ) : null}
      </MainHeader>

      <MainBody>
        {!projectId ? (
          <StarterMessage />
        ) : !project ? (
          <Navigate to="/project/" />
        ) : (
          <Outlet context={{ view }} />
        )}
      </MainBody>
    </>
  );
}

function StarterMessage(props) {
  return (
    <>
      <Typography
        variant="h4"
        align="center"
        sx={{
          marginTop: "3rem",
          fontWeight: "fontWeightLight",
          color: "text.primary",
        }}
      >
        Select a project
      </Typography>
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
}
