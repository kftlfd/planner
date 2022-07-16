import React, { useState, useEffect } from "react";
import {
  Navigate,
  Outlet,
  useNavigate,
  useParams,
  useMatch,
} from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchProjects,
  selectProjectIds,
  selectProjectById,
  addProject,
} from "../store/projectsSlice";
import { loadTasks } from "../store/tasksSlice";

import * as api from "../api/client";

import { useAuth } from "../context/AuthContext";
import { useColorMode } from "../context/ThemeContext";

import { LoadingApp } from "../components/Loading";
import { Drawer } from "../layout/Drawer";
import { MainWrapper } from "../layout/Main";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  TextField,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListIcon from "@mui/icons-material/List";
import AddIcon from "@mui/icons-material/Add";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function Home(props) {
  const { user } = useAuth();
  const rootPath = useMatch("/");
  const dispatch = useDispatch();
  const projectsStatus = useSelector((state) => state.projects.status);
  const loading = projectsStatus === "idle" || projectsStatus === "loading";

  useEffect(() => {
    if (projectsStatus === "idle") {
      dispatch(fetchProjects(user.id)());
    }
  }, [projectsStatus, dispatch]);

  if (!user) return <Navigate to="/welcome" />;

  if (loading) return <LoadingApp message={"Loading projects"} />;

  if (rootPath) return <Navigate to="/project/" />;

  return <HomeContent />;
}

function HomeContent(props) {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const drawerWidth = 240;
  const [drawerOpen, setDrawerOpen] = useState(!smallScreen);
  const drawerToggle = () => setDrawerOpen((drawerOpen) => !drawerOpen);
  const handleCloseDrawer = () => {
    if (smallScreen) drawerToggle();
  };

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

function UserButtons(props) {
  const { user, logout } = useAuth();

  const [nestedListOpen, setNestedListOpen] = useState(false);
  const toggleNestedList = () => setNestedListOpen(!nestedListOpen);

  return (
    <List>
      <ListItemButton
        key="user"
        onClick={toggleNestedList}
        selected={nestedListOpen}
      >
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText>{user.username}</ListItemText>
        {nestedListOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={nestedListOpen} timeout="auto">
        <List component="div" disablePadding>
          <ListItemButton key="settings-button">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </ListItemButton>

          <ListItemButton key="logout-button" onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText>Log Out</ListItemText>
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
}

function ProjectsButtons(props) {
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

function ProjectCreateButton(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const toggleCreateDialog = () => setCreateDialogOpen(!createDialogOpen);

  const [nameValue, setNameValue] = useState("");
  const handleNameChange = (e) => setNameValue(e.target.value);

  const handleCreateProject = async (event) => {
    event.preventDefault();
    try {
      const newProject = await api.projects.create(nameValue);
      dispatch(addProject(newProject));
      dispatch(loadTasks({ tasks: {}, projectId: newProject.id, ids: [] }));
      navigate(`/project/${newProject.id}`);
    } catch (error) {
      console.error(error);
    }
    toggleCreateDialog();
  };

  return (
    <>
      <ListItemButton
        id={"create-new-project-button"}
        onClick={toggleCreateDialog}
        sx={{ marginTop: "1rem" }}
      >
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText>Create new project</ListItemText>
      </ListItemButton>

      <Dialog open={createDialogOpen} onClose={toggleCreateDialog}>
        <DialogTitle>Create new project</DialogTitle>
        <form onSubmit={handleCreateProject}>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              type="text"
              name="name"
              placeholder="Project Name"
              value={nameValue}
              onChange={handleNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit" disabled={!nameValue}>
              Create
            </Button>
            <Button onClick={toggleCreateDialog}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

function ThemeSwitch(props) {
  const colorMode = useColorMode();

  return (
    <List>
      <ListItemButton onClick={colorMode.toggleColorMode}>
        <ListItemIcon>
          {colorMode.mode === "light" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </ListItemIcon>
        <ListItemText
          primary={`Theme: ${colorMode.mode === "light" ? "Light" : "Dark"}`}
        />
      </ListItemButton>
    </List>
  );
}
