import { FC, ReactNode } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";

import {
  AddCircle,
  CalendarMonth,
  ViewColumn,
  ViewList,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { MainBody, MainHeader } from "~/layout/Main";
import { useAppSelector } from "~/store/hooks";
import { selectProjectById } from "~/store/projectsSlice";
import { ProjectView, selectProjectView } from "~/store/settingsSlice";

import { ProjectChat } from "./ProjectChat";
import { ProjectOptionsMenu } from "./ProjectOprionsMenu";

const Project: FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useAppSelector(selectProjectById(Number(projectId)));
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
          <Outlet />
        )}
      </MainBody>
    </>
  );
};

export default Project;

const RightButtonsContainer = styled(Box)(({ theme: { spacing } }) => ({
  display: "flex",
  gap: spacing(2),
  marginLeft: spacing(2),
}));

const OptionsViewsSwitchContainer = styled(Box)(({ theme: { spacing } }) => ({
  display: "flex",
  justifyContent: "center",
  paddingBottom: spacing(1),
}));

type ViewButtonProps = {
  viewName: ProjectView;
  icon: ReactNode;
};
const ViewButton: FC<ViewButtonProps> = ({ viewName, icon }) => {
  const view = useAppSelector(selectProjectView);
  const actions = useActions();

  return (
    <Button
      value={viewName}
      variant={view === viewName ? "contained" : "outlined"}
      onClick={() => {
        actions.settings.setProjectView(viewName);
      }}
    >
      {icon}
    </Button>
  );
};

type ViewButtonGroupProps = {
  large?: boolean;
};
const ViewButtonGroup: FC<ViewButtonGroupProps> = ({ large }) => (
  <ButtonGroup size={large ? "large" : "small"} disableElevation>
    <ViewButton viewName="list" icon={<ViewList />} />
    <ViewButton viewName="board" icon={<ViewColumn />} />
    <ViewButton viewName="calendar" icon={<CalendarMonth />} />
  </ButtonGroup>
);

const StarterMessage: FC = () => {
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

const StarterMessageContainer = styled(Box)(({ theme: { spacing } }) => ({
  marginTop: spacing(6),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: spacing(3),
}));

const StarterMessageText = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightLight,
  color: theme.palette.text.primary,
}));
