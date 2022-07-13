import React, { useState, useMemo } from "react";
import {
  Navigate,
  Outlet,
  useNavigate,
  useParams,
  useMatch,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useColorMode } from "../context/ThemeContext";
import ProvideProjects, { useProjects } from "../context/ProjectsContext";

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
  return (
    <ProvideProjects>
      <HomeWrapper />
    </ProvideProjects>
  );
}

function HomeWrapper(props) {
  const { user } = useAuth();
  const { loading } = useProjects();
  const rootPath = useMatch("/");

  return useMemo(
    () => (
      <>
        {!user ? (
          <Navigate to="/welcome" />
        ) : loading ? (
          <LoadingApp message={"Loading projects"} />
        ) : rootPath ? (
          <Navigate to="/project/" />
        ) : (
          <HomeContent />
        )}
      </>
    ),
    [user, loading, rootPath]
  );
}

function HomeContent(props) {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const drawerWidth = 240;
  const [drawerOpen, setDrawerOpen] = useState(!smallScreen);
  const drawerToggle = () => setDrawerOpen((drawerOpen) => !drawerOpen);

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
          <ProjectsButtons drawerToggle={drawerToggle} />
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
  const auth = useAuth();

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
        <ListItemText>{auth.user.username}</ListItemText>
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

          <ListItemButton key="logout-button" onClick={auth.logout}>
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
  const { projects } = useProjects();
  const navigate = useNavigate();

  return (
    <>
      {Object.keys(projects).map((id) => (
        <ListItemButton
          key={"pj-" + id}
          selected={projectId === id}
          onClick={
            projectId === id
              ? () => props.drawerToggle()
              : () => {
                  navigate(`project/${id}`);
                  props.drawerToggle();
                }
          }
        >
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText
            primary={projects[id].name}
            sx={{
              span: {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          />
        </ListItemButton>
      ))}
    </>
  );
}

function ProjectCreateButton(props) {
  const { handleProjects } = useProjects();
  const navigate = useNavigate();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const toggleCreateDialog = () => setCreateDialogOpen(!createDialogOpen);

  const [nameValue, setNameValue] = useState("");
  const handleNameChange = (e) => setNameValue(e.target.value);

  const handleCreateProject = async (event) => {
    event.preventDefault();
    const newProject = await handleProjects.create(nameValue);
    toggleCreateDialog();
    navigate(`/project/${newProject.id}`);
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
