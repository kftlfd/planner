import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useColorMode } from "../../context/ThemeContext";
import { useActions } from "../../context/ActionsContext";
import {
  selectProjectById,
  selectSharedProjectIds,
} from "../../store/projectsSlice";
import { selectUserById } from "../../store/usersSlice";
import { Sidebar, SidebarHeader, SidebarBody } from "../../layout/Sidebar";
import { MenuListItem } from "./ProjectOprionsMenu";
import { SimpleModal } from "../../layout/Modal";
import { ErrorAlert } from "../../layout/Alert";

import {
  Typography,
  Box,
  Card,
  Link,
  IconButton,
  Switch,
  Checkbox,
  Tooltip,
  Avatar,
  CircularProgress,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export function ProjectSharing(props) {
  const { closeOptionsMenu } = props;
  const { projectId } = useParams();
  const actions = useActions();
  const project = useSelector(selectProjectById(projectId));
  const sharedIds = useSelector(selectSharedProjectIds);
  const isOwned = !sharedIds.includes(Number(projectId));

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    if (!sidebarOpen) closeOptionsMenu();
    setSidebarOpen((x) => !x);
  };

  const [sharingToggle, setSharingToggle] = useState(project.sharing);

  const [loadingSharing, setLoadingSharing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [stopSharingDialogOpen, setStopSharingDialogOpen] = useState(false);
  const stopSharingDialogToggle = () => setStopSharingDialogOpen((x) => !x);

  useEffect(() => {
    setSharingToggle(project.sharing);
  }, [project]);

  async function handleEnableSharing() {
    setSharingToggle(true);
    setLoadingSharing(true);
    try {
      await actions.project.sharing.enable(projectId);
      setLoadingSharing(false);
    } catch (error) {
      console.error("Failed to start sharing: ", error);
      setSharingToggle(false);
      setLoadingSharing(false);
      setError("Can't enable sharing");
    }
  }

  async function handleDisableSharing() {
    setLoading(true);
    try {
      await actions.project.sharing.disable(projectId);
      setLoading(false);
      setSharingToggle(false);
      stopSharingDialogToggle();
    } catch (error) {
      console.error("Failed to stop sharing: ", error);
      setLoading(false);
      setSharingToggle(true);
      setError("Can't update sharing");
    }
  }

  const sharingDisabled = (
    <Typography
      variant="h5"
      align="center"
      sx={{ marginTop: "1rem", fontWeight: "fontWeightLight" }}
    >
      Sharing is Off
    </Typography>
  );

  const sharingLoading = (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress size={50} />
    </Box>
  );

  return (
    <>
      <MenuListItem onClick={toggleSidebar}>
        {isOwned ? "Project sharing" : "Project info"}
        {isOwned && <Checkbox color="primary" checked={sharingToggle} />}
      </MenuListItem>

      <Sidebar open={sidebarOpen} toggle={toggleSidebar}>
        <SidebarHeader
          title={isOwned ? "Project sharing" : "Project info"}
          toggle={toggleSidebar}
        >
          {isOwned && (
            <>
              <SharingSwitch
                checked={sharingToggle}
                onChange={
                  sharingToggle ? stopSharingDialogToggle : handleEnableSharing
                }
              />

              <SimpleModal
                open={stopSharingDialogOpen}
                onClose={stopSharingDialogToggle}
                onConfirm={handleDisableSharing}
                title={"Stop sharing project?"}
                content={"It will do something unreversible."}
                action={"Stop sharing"}
                loading={loading}
              />

              <ErrorAlert
                open={error !== null}
                toggle={() => setError(null)}
                message={error}
              />
            </>
          )}
        </SidebarHeader>

        <SidebarBody
          sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}
        >
          {loadingSharing ? (
            <>{sharingLoading}</>
          ) : !sharingToggle ? (
            <>{sharingDisabled}</>
          ) : (
            <>
              <InviteLink
                projectId={projectId}
                inviteCode={project.invite}
                canEdit={isOwned}
              />

              <ProjectMembers projectId={projectId} />
            </>
          )}
        </SidebarBody>
      </Sidebar>
    </>
  );
}

function SharingSwitch(props) {
  const { checked, onChange } = props;

  return (
    <Switch
      checked={checked}
      onChange={onChange}
      sx={{
        padding: 0,
        "& .MuiSwitch-thumb": {
          fontFamily: "Roboto, sans-serif",
          fontSize: "0.9rem",
          borderRadius: "7px",
          height: "32px",
          width: "32px",
          display: "grid",
          placeContent: "center",
          "&:before": {
            content: "'Off'",
            color: "black",
          },
        },
        "& .MuiSwitch-switchBase": {
          padding: "3px",
          "&.Mui-checked": {
            "& .MuiSwitch-thumb:before": {
              content: "'On'",
              color: "white",
            },
          },
        },
      }}
    />
  );
}

function InviteLink(props) {
  const { projectId, inviteCode } = props;
  const colorMode = useColorMode();
  const actions = useActions();
  const inviteLink = `${window.location.origin}/invite/${inviteCode}`;

  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  const [loadingRecreate, setLoadingRecreate] = React.useState(false);
  const [loadingDelete, setLoadingDelete] = React.useState(false);

  function copyInviteLinkToClipboard() {
    navigator.clipboard.writeText(inviteLink);
    setTooltipOpen(true);
    setTimeout(() => setTooltipOpen(false), 3000);
  }

  async function handleInviteRecreate() {
    setLoadingRecreate(true);
    try {
      await actions.project.sharing.recreateInvite(projectId);
      setLoadingRecreate(false);
    } catch (error) {
      console.error("Invite recreate: ", error);
      setLoadingRecreate(false);
    }
  }

  async function handleInviteDelete() {
    setLoadingDelete(true);
    try {
      await actions.project.sharing.deleteInvite(projectId);
      setLoadingDelete(false);
    } catch (error) {
      console.error("Invite delete: ", error);
      setLoadingDelete(false);
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <Typography variant="h6" conponent="div">
        Link
      </Typography>

      <Tooltip title="Copied link to clipboard" open={tooltipOpen} arrow>
        <Card
          variant="outlined"
          sx={{
            backgroundColor:
              colorMode.mode === "light"
                ? "rgba(250, 250, 250, 0.8)"
                : "rgba(20, 20, 20, 0.8)",
            position: "relative",
            flexGrow: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.2rem 0.5rem 0.2rem 1rem",
            overflow: "hidden",
          }}
        >
          {inviteCode ? (
            <Link
              underline={"hover"}
              onClick={copyInviteLinkToClipboard}
              sx={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                direction: "rtl",
                userSelect: "all",
              }}
            >
              {inviteLink}
            </Link>
          ) : (
            <Box sx={{ opacity: 0.5 }}>Disabled</Box>
          )}

          <IconButton
            onClick={copyInviteLinkToClipboard}
            disabled={!inviteCode}
          >
            <ContentCopyIcon />
          </IconButton>
        </Card>
      </Tooltip>

      {props.canEdit && (
        <>
          <IconButton
            onClick={handleInviteRecreate}
            disabled={loadingRecreate}
            sx={{ position: "relative" }}
          >
            <ChangeCircleIcon />
            {loadingRecreate && (
              <CircularProgress size={30} sx={{ position: "absolute" }} />
            )}
          </IconButton>

          <IconButton
            onClick={handleInviteDelete}
            disabled={!inviteCode || loadingDelete}
            sx={{ position: "relative" }}
          >
            <CancelIcon />
            {loadingDelete && (
              <CircularProgress size={30} sx={{ position: "absolute" }} />
            )}
          </IconButton>
        </>
      )}
    </Box>
  );
}

function ProjectMembers({ projectId }) {
  const project = useSelector(selectProjectById(projectId));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Typography variant="h6" conponent="div">
          Members
        </Typography>
        {project.members.length + 1}
      </Box>
      <MemberListItem userId={project.owner} owner={true} />
      {project.members.map((userId) => (
        <MemberListItem key={"memb" + userId} userId={userId} />
      ))}
    </Box>
  );
}

function MemberListItem({ userId, owner }) {
  const user = useSelector(selectUserById(userId));

  if (!user) return <div>???</div>;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <Avatar sx={{ width: "2rem", height: "2rem" }}>{user.username[0]}</Avatar>
      <Box>{user.username}</Box>
      {owner && (
        <Box
          sx={{
            fontSize: "0.85rem",
            fontWeight: "bold",
            border: "1px solid tomato",
            borderRadius: "0.5rem",
            padding: "0.2rem 0.4rem",
          }}
        >
          Owner
        </Box>
      )}
    </Box>
  );
}
