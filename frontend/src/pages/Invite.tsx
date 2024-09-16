import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Typography,
} from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { CenterCard } from "~/layout/CenterCard";
import {
  selectLoadingProjects,
  selectProjectIds,
  selectSharedProjectIds,
} from "~/store/projectsSlice";
import { selectUser } from "~/store/usersSlice";
import { IProject } from "~/types/projects.types";
import { IUser } from "~/types/users.types";

const Invite: FC = () => {
  const { inviteCode } = useParams();
  const user = useSelector(selectUser);
  const loadingProjects = useSelector(selectLoadingProjects);
  const actions = useActions();
  const navigate = useNavigate();

  const ownedProjects = useSelector(selectProjectIds);
  const sharedProjects = useSelector(selectSharedProjectIds);

  const [loading, setLoading] = useState(true);

  const [projectInfo, setProjectInfo] = useState<
    | { project: IProject; owner: IUser; error: null }
    | { project: null; owner: null; error: string }
  >({ project: null, owner: null, error: "" });

  const [projectJoin, setProjectJoin] = useState<{
    loading: boolean;
    joined: boolean;
    errorMsg: string | null;
  }>({ loading: false, joined: false, errorMsg: null });

  useEffect(() => {
    const loadProjectInfo = async () => {
      if (!inviteCode) return;
      setLoading(true);
      try {
        const p = await actions.invite.get(inviteCode);
        if (
          ownedProjects.includes(p.project.id) ||
          sharedProjects.includes(p.project.id)
        ) {
          navigate(`/project/${p.project.id}/`);
        } else {
          setProjectInfo({ ...p, error: null });
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch project info: ", error);
        setProjectInfo({
          project: null,
          owner: null,
          error: "Project not found",
        });
        setLoading(false);
      }
    };

    if (user && !loadingProjects && !loading) {
      void loadProjectInfo();
    }
  }, [
    user,
    loadingProjects,
    inviteCode,
    actions.invite,
    ownedProjects,
    sharedProjects,
    navigate,
    loading,
  ]);

  const handleJoin = async () => {
    if (!inviteCode) return;
    setProjectJoin((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      const p = await actions.invite.join(inviteCode);
      setProjectJoin((prev) => ({
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
  };

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
          onClick={() => {
            navigate("/login?next=" + window.location.pathname);
          }}
        >
          Log In
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            navigate("/register?next=" + window.location.pathname);
          }}
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
      ) : projectInfo.error !== null ? (
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
              text={String(projectInfo.project.members.length + 1)}
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
              onClick={() => void handleJoin()}
              color={projectJoin.joined ? "success" : "primary"}
              disabled={projectJoin.loading}
            >
              Join
            </Button>
            {projectJoin.loading && (
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

          {projectJoin.errorMsg ? (
            <Alert severity="warning" sx={{ marginTop: "1rem" }}>
              <AlertTitle>{projectJoin.errorMsg}</AlertTitle>
            </Alert>
          ) : null}
        </>
      )}
    </CenterCard>
  );
};

export default Invite;

const ProjectInfoDisplay: FC<{
  title: string;
  text: string;
}> = ({ title, text }) => (
  <>
    <Typography variant="body1" component="div">
      {title}:
    </Typography>

    <Typography variant="body1" component="div" sx={{ wordBreak: "break-all" }}>
      <b>{text}</b>
    </Typography>
  </>
);
