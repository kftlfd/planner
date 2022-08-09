import React from "react";
import { useParams, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectProjectView } from "../../store/settingsSlice";
import { selectProjectById } from "../../store/projectsSlice";
import { useActions } from "../../context/ActionsContext";
import { MainHeader, MainBody } from "../../layout/Main";
import { ProjectOptionsMenu } from "./ProjectOprionsMenu";
import { ProjectChat } from "./ProjectChat";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
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

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

  function ViewButtonGroup(props) {
    return (
      <ButtonGroup
        size={props.hasOwnProperty("large") ? "large" : "small"}
        disableElevation
      >
        <ViewButton viewName="list" icon={<ViewListIcon />} />
        <ViewButton viewName="board" icon={<ViewColumnIcon />} />
        <ViewButton viewName="calendar" icon={<CalendarMonthIcon />} />
      </ButtonGroup>
    );
  }

  return (
    <>
      <MainHeader title={project ? project.name : null}>
        {project ? (
          <Box sx={{ display: "flex", gap: "1rem", marginLeft: "1rem" }}>
            {project.sharing && <ProjectChat />}
            {!smallScreen && <ViewButtonGroup />}
            <ProjectOptionsMenu>
              {smallScreen && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    paddingBottom: "0.5rem",
                  }}
                >
                  <ViewButtonGroup large />
                </Box>
              )}
            </ProjectOptionsMenu>
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
  const containerStyle = {
    marginTop: "3rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
  };

  const textStyle = {
    fontWeight: "fontWeightLight",
    color: "text.primary",
  };

  const iconStyle = {
    svg: { fontSize: "10rem" },
  };

  function handleClick() {
    document.getElementById("create-new-project-button").click();
  }

  return (
    <Box sx={containerStyle}>
      <Typography variant="h4" sx={textStyle}>
        Select a project
      </Typography>

      <Typography variant="h6" sx={textStyle}>
        or
      </Typography>

      <Typography variant="h5" sx={textStyle}>
        Create New Project
      </Typography>

      <IconButton onClick={handleClick} sx={iconStyle}>
        <AddCircleIcon />
      </IconButton>
    </Box>
  );
}
