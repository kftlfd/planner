import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectUser } from "../store/usersSlice";
import {
  selectLoadingProjects,
  selectProjectIds,
  selectSharedProjectIds,
} from "../store/projectsSlice";
import { useActions } from "../context/ActionsContext";
import { CenterCard } from "../layout/CenterCard";

import {
  Typography,
  Box,
  Button,
  Skeleton,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";

export default function Invite() {
  const { inviteCode } = useParams();
  const user = useSelector(selectUser);
  const loadingProjects = useSelector(selectLoadingProjects);
  const actions = useActions();
  const navigate = useNavigate();

  const projectsStatus = useSelector((state) => state.projects.status);
  const ownedProjects = useSelector(selectProjectIds);
  const sharedProjects = useSelector(selectSharedProjectIds);

  const [loading, setLoading] = React.useState(true);
  const [projectInfo, setProjectInfo] = React.useState({});

  React.useEffect(() => {
    if (user && !loadingProjects) loadProjectInfo();
  }, [user, projectsStatus]);

  async function loadProjectInfo() {
    try {
      const p = await actions.invite.get(inviteCode);
      if (
        ownedProjects.includes(p.project.id) ||
        sharedProjects.includes(p.project.id)
      ) {
        navigate(`/project/${p.project.id}/`);
      } else {
        setProjectInfo(p);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch project info: ", error);
      setProjectInfo({ error: "Project not found" });
      setLoading(false);
    }
  }

  async function handleJoin() {
    setProjectInfo((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      const p = await actions.invite.join(inviteCode);
      setProjectInfo((prev) => ({
        ...prev,
        joined: true,
        loading: false,
      }));
      setTimeout(() => {
        navigate(`/project/${p.id}`);
      }, 1000);
    } catch (error) {
      console.error("Failed to join project: ", error);
      setProjectInfo((prev) => ({
        ...prev,
        joined: false,
        loading: false,
        errorMsg: "Failed to join project, try again later.",
      }));
    }
  }

  const requireAuth = (
    <>
      <Typography variant="h5" component="div" align="center">
        Log In to view invite
      </Typography>

      <Box
        sx={{
          marginTop: "2rem",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <Button
          variant="contained"
          onClick={() => navigate("/login?next=" + window.location.pathname)}
        >
          Log In
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/register?next=" + window.location.pathname)}
        >
          Sign Up
        </Button>
      </Box>
    </>
  );

  const loadingState = (
    <>
      <Skeleton height={50} sx={{ width: "60%", margin: "auto" }} />
      <Skeleton height={120} />
      <Skeleton height={50} sx={{ width: 100, margin: "auto" }} />
    </>
  );

  return (
    <CenterCard>
      {!user ? (
        <>{requireAuth}</>
      ) : loading ? (
        <>{loadingState}</>
      ) : projectInfo.error ? (
        <Typography variant="h5" component="div" align="center">
          {projectInfo.error}
        </Typography>
      ) : (
        <>
          <Typography variant="h5" component="div" align="center">
            Project Invite
          </Typography>

          <Box
            sx={{
              marginBlock: "2rem",
              display: "grid",
              gridTemplateColumns: "max-content auto",
              gap: "0.5rem 1rem",
            }}
          >
            <ProjectInfoDisplay
              title={"Project"}
              text={projectInfo.project.name}
            />
            <ProjectInfoDisplay
              title={"Owner"}
              text={projectInfo.owner.username}
            />
            <ProjectInfoDisplay
              title={"Members"}
              text={projectInfo.project.members.length + 1}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              placeContent: "center",
              position: "relative",
            }}
          >
            <Button
              variant="contained"
              onClick={handleJoin}
              color={projectInfo.joined ? "success" : "primary"}
              disabled={projectInfo.loading}
            >
              Join
            </Button>
            {projectInfo.loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>

          {projectInfo.errorMsg ? (
            <Alert severity="warning" sx={{ marginTop: "1rem" }}>
              <AlertTitle>{projectInfo.errorMsg}</AlertTitle>
            </Alert>
          ) : null}
        </>
      )}
    </CenterCard>
  );
}

function ProjectInfoDisplay(props) {
  return (
    <>
      <Typography variant="body1" component="div">
        {props.title}:
      </Typography>

      <Typography
        variant="body1"
        component="div"
        sx={{ wordBreak: "break-all" }}
      >
        <b>{props.text}</b>
      </Typography>
    </>
  );
}
