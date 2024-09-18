import { FC, lazy, Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useMatch } from "react-router-dom";

import { Box, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useActions } from "~/context/ActionsContext";
import { LoadingSpinner } from "~/layout/Loading";
import { Main, MainDrawer } from "~/layout/Main";
import {
  selectProjectIds,
  selectSharedProjectIds,
} from "~/store/projectsSlice";
import { selectNavDrawerOpen } from "~/store/settingsSlice";
import { selectUser } from "~/store/usersSlice";

import { ProjectCreateButton } from "./ProjectCreateButton";
import { ThemeSwitch } from "./ThemeSwitch";
import { UserButtons } from "./UserButtons";

const ProjectsButtons = lazy(() => import("./ProjectsButtons"));

const loadingSpinner = (
  <Box>
    <LoadingSpinner size={50} />
  </Box>
);

const Home: FC = () => {
  const user = useSelector(selectUser);
  const rootPath = useMatch("/");

  const ownedProjectIds = useSelector(selectProjectIds);
  const sharedProjectIds = useSelector(selectSharedProjectIds);
  const navDrawer = useSelector(selectNavDrawerOpen);
  const actions = useActions();

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const navDrawerOpen = navDrawer === null ? !smallScreen : navDrawer;
  const [drawerOpen, setDrawerOpen] = useState(navDrawerOpen);
  const drawerToggle = () => {
    setDrawerOpen((drawerOpen) => !drawerOpen);
    actions.settings.toggleNavDrawer();
  };
  const handleCloseDrawer = () => {
    if (smallScreen) drawerToggle();
  };

  if (!user) return <Navigate to="/welcome" />;
  if (rootPath) return <Navigate to="/project/" />;

  return (
    <Main>
      <MainDrawer
        drawerOpen={drawerOpen}
        drawerToggle={drawerToggle}
        smallScreen={smallScreen}
      >
        <Divider />
        <UserButtons drawerToggle={handleCloseDrawer} />
        <Divider />

        {ownedProjectIds.length > 0 ? (
          <Suspense fallback={loadingSpinner}>
            <ProjectsButtons
              type="owned"
              header={"Projects"}
              projectIds={ownedProjectIds}
              drawerToggle={handleCloseDrawer}
            />
          </Suspense>
        ) : null}

        {sharedProjectIds.length > 0 ? (
          <Suspense fallback={loadingSpinner}>
            <ProjectsButtons
              type="shared"
              header={"Shared projects"}
              projectIds={sharedProjectIds}
              drawerToggle={handleCloseDrawer}
            />
          </Suspense>
        ) : null}

        <ProjectCreateButton drawerToggle={handleCloseDrawer} />

        <div style={{ flexGrow: 1 }} />
        <Divider />
        <ThemeSwitch />
      </MainDrawer>

      <Outlet context={{ drawerOpen, drawerToggle }} />
    </Main>
  );
};

export default Home;
