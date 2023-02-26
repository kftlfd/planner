import React from "react";
import { useParams, Navigate, Outlet } from "react-router-dom";
import {
  Typography,
  Box,
  IconButton,
  ButtonGroup,
  Button,
  useTheme,
  useMediaQuery,
  styled,
} from "@mui/material";
import {
  AddCircle,
  ViewList,
  ViewColumn,
  CalendarMonth,
} from "@mui/icons-material";

import { useAppSelector } from "app/store/hooks";
import { selectProjectView } from "app/store/settingsSlice";
import { selectProjectById } from "app/store/projectsSlice";
import { useActions } from "app/context/ActionsContext";
import { MainHeader, MainBody } from "app/layout/Main";

import { ProjectOptionsMenu } from "./ProjectOprionsMenu";
import { ProjectChat } from "./ProjectChat";

const Project: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useAppSelector(selectProjectById(Number(projectId)));
  const view = useAppSelector(selectProjectView);
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <MainHeader title={project?.name || ""}>
        {project && (
          <RightButtonsContainer>
            {project.sharing && <ProjectChat />}

            {!smallScreen && <ViewButtonGroup />}

            <ProjectOptionsMenu>
              {smallScreen && (
                <OptionsViewsSwitchContainer>
                  <ViewButtonGroup large />
                </OptionsViewsSwitchContainer>
              )}
            </ProjectOptionsMenu>
          </RightButtonsContainer>
        )}
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
};

export default Project;

const RightButtonsContainer = styled(Box)({
  display: "flex",
  gap: "1rem",
  marginLeft: "1rem",
});

const OptionsViewsSwitchContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  paddingBottom: "0.5rem",
});

type ViewButtonProps = {
  viewName: string;
  icon: React.ReactNode;
};
const ViewButton: React.FC<ViewButtonProps> = ({ viewName, icon }) => {
  const view = useAppSelector(selectProjectView);
  const actions = useActions();

  return (
    <Button
      value={viewName}
      variant={view === viewName ? "contained" : "outlined"}
      onClick={() => actions.settings.setProjectView(viewName)}
    >
      {icon}
    </Button>
  );
};

type ViewButtonGroupProps = {
  large?: boolean;
};
const ViewButtonGroup: React.FC<ViewButtonGroupProps> = ({ large }) => (
  <ButtonGroup size={large ? "large" : "small"} disableElevation>
    <ViewButton viewName="list" icon={<ViewList />} />
    <ViewButton viewName="board" icon={<ViewColumn />} />
    <ViewButton viewName="calendar" icon={<CalendarMonth />} />
  </ButtonGroup>
);

const StarterMessage: React.FC = () => {
  function handleClick() {
    document.getElementById("create-new-project-button")?.click();
  }

  return (
    <StarterMessageContainer>
      <StarterMessageText variant="h4">Select a project</StarterMessageText>
      <StarterMessageText variant="h6">or</StarterMessageText>
      <StarterMessageText variant="h5">Create New Project</StarterMessageText>
      <IconButton onClick={handleClick}>
        <AddCircle sx={{ fontSize: "10rem" }} />
      </IconButton>
    </StarterMessageContainer>
  );
};

const StarterMessageContainer = styled(Box)({
  marginTop: "3rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1.5rem",
});

const StarterMessageText = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightLight,
  color: theme.palette.text.primary,
}));
