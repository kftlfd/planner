import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useMatch } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../../store/projectsSlice";

import { LoadingApp } from "../../components/Loading";
import { Drawer } from "../../layout/Drawer";
import { MainWrapper } from "../../layout/Main";

import { UserButtons } from "./UserButtons";
import { ProjectsButtons } from "./ProjectsButtons";
import { ProjectCreateButton } from "./ProjectCreateButton";
import { ThemeSwitch } from "./ThemeSwitch";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Divider, List, ListSubheader } from "@mui/material";

export default function Home(props) {
  const { user } = useAuth();
  const rootPath = useMatch("/");

  const dispatch = useDispatch();
  const projectsStatus = useSelector((state) => state.projects.status);

  const loading = projectsStatus === "idle" || projectsStatus === "loading";

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const drawerWidth = 240;
  const [drawerOpen, setDrawerOpen] = useState(!smallScreen);
  const drawerToggle = () => setDrawerOpen((drawerOpen) => !drawerOpen);
  const handleCloseDrawer = () => {
    if (smallScreen) drawerToggle();
  };

  useEffect(() => {
    if (user && projectsStatus === "idle") {
      dispatch(fetchProjects(user.id)());
    }
  }, [projectsStatus, dispatch]);

  if (!user) return <Navigate to="/welcome" />;
  if (loading) return <LoadingApp message={"Loading projects"} />;
  if (rootPath) return <Navigate to="/project/" />;

  return (
    <MainWrapper>
      <Drawer
        drawerOpen={drawerOpen}
        drawerToggle={drawerToggle}
        drawerWidth={drawerWidth}
        smallScreen={smallScreen}
      >
        <Divider />
        <UserButtons />
        <Divider />
        <List
          subheader={<ListSubheader component="div">Projects</ListSubheader>}
        >
          <ProjectsButtons drawerToggle={handleCloseDrawer} />
          <ProjectCreateButton />
        </List>
        <div style={{ flexGrow: 1 }} />
        <Divider />
        <ThemeSwitch />
      </Drawer>

      <Outlet context={{ drawerWidth, drawerOpen, drawerToggle }} />
    </MainWrapper>
  );
}
