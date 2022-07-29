import React, { useState } from "react";
import { Navigate, Outlet, useMatch } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectUser } from "../../store/usersSlice";
import {
  selectProjectIds,
  selectSharedProjectIds,
} from "../../store/projectsSlice";
import { Main, MainDrawer } from "../../layout/Main";
import { UserButtons } from "./UserButtons";
import { ProjectsButtons } from "./ProjectsButtons";
import { ProjectCreateButton } from "./ProjectCreateButton";
import { ThemeSwitch } from "./ThemeSwitch";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Divider } from "@mui/material";

export default function Home(props) {
  const user = useSelector(selectUser);
  const rootPath = useMatch("/");

  const ownedProjectIds = useSelector(selectProjectIds);
  const sharedProjectIds = useSelector(selectSharedProjectIds);

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(!smallScreen);
  const drawerToggle = () => setDrawerOpen((drawerOpen) => !drawerOpen);
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
        <UserButtons />
        <Divider />

        {ownedProjectIds.length > 0 ? (
          <ProjectsButtons
            type="owned"
            header={"Projects"}
            projectIds={ownedProjectIds}
            drawerToggle={handleCloseDrawer}
          />
        ) : null}

        {sharedProjectIds.length > 0 ? (
          <ProjectsButtons
            type="shared"
            header={"Shared projects"}
            projectIds={sharedProjectIds}
            drawerToggle={handleCloseDrawer}
          />
        ) : null}

        <ProjectCreateButton />

        <div style={{ flexGrow: 1 }} />
        <Divider />
        <ThemeSwitch />
      </MainDrawer>

      <Outlet context={{ drawerOpen, drawerToggle }} />
    </Main>
  );
}
