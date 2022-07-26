import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useColorMode } from "../../context/ThemeContext";
import { useActions } from "../../context/ActionsContext";
import {
  selectProjectById,
  selectSharedProjectIds,
} from "../../store/projectsSlice";
import { Sidebar, SidebarHeader, SidebarBody } from "../../layout/Sidebar";
import { MenuListItem } from "./ProjectOprionsMenu";
import { SimpleModal } from "../../layout/Modal";

import {
  Typography,
  Box,
  Card,
  Link,
  IconButton,
  Switch,
  Checkbox,
  Tooltip,
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
  const isShared = sharedIds.includes(Number(projectId));

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    if (!sidebarOpen) closeOptionsMenu();
    setSidebarOpen((x) => !x);
  };

  const [projectSharing, setProjectSharing] = useState(project.sharing);
  const projectSharingToggle = () => setProjectSharing((x) => !x);

  const [stopSharingDialogOpen, setStopSharingDialogOpen] = useState(false);
  const stopSharingDialogToggle = () => setStopSharingDialogOpen((x) => !x);

  useEffect(() => {
    setProjectSharing(project.sharing);
  }, [project]);

  async function handleEnableSharing() {
    projectSharingToggle();
    try {
      await actions.project.sharing.enable(projectId);
    } catch (error) {
      console.error("Failed to start sharing: ", error);
      setProjectSharing(false);
    }
  }

  async function handleDisableSharing() {
    stopSharingDialogToggle();
    projectSharingToggle();
    try {
      await actions.project.sharing.disable(projectId);
    } catch (error) {
      console.error("Failed to stop sharing: ", error);
      setProjectSharing(true);
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

  if (isShared) return null;

  return (
    <>
      <MenuListItem onClick={toggleSidebar}>
        Project sharing
        <Checkbox color="primary" checked={projectSharing} />
      </MenuListItem>

      <Sidebar open={sidebarOpen} toggle={toggleSidebar}>
        <SidebarHeader title="Project sharing" toggle={toggleSidebar}>
          <SharingSwitch
            checked={projectSharing}
            onChange={
              projectSharing ? stopSharingDialogToggle : handleEnableSharing
            }
          />
        </SidebarHeader>

        <SidebarBody
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {!projectSharing ? (
            <>{sharingDisabled}</>
          ) : (
            <>
              <InviteLink projectId={projectId} inviteCode={project.invite} />
              <div>Members: {project.members.length + 1}</div>
              <div>Owner: {project.owner}</div>
              {project.members.map((member) => (
                <div key={`member-${member}`}>{member}</div>
              ))}
            </>
          )}
        </SidebarBody>

        <SimpleModal
          open={stopSharingDialogOpen}
          onClose={stopSharingDialogToggle}
          onConfirm={handleDisableSharing}
          title={"Stop sharing project?"}
          content={"It will do something unreversible."}
          action={"Stop sharing"}
        />
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

  function copyInviteLinkToClipboard() {
    navigator.clipboard.writeText(inviteLink);
    setTooltipOpen(true);
    setTimeout(() => setTooltipOpen(false), 3000);
  }

  async function handleInviteRecreate() {
    try {
      await actions.project.sharing.recreateInvite(projectId);
    } catch (error) {
      console.error("Invite recreate: ", error);
    }
  }

  async function handleInviteDelete() {
    try {
      await actions.project.sharing.deleteInvite(projectId);
    } catch (error) {
      console.error("Invite delete: ", error);
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
        Link:
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

      <IconButton onClick={handleInviteRecreate}>
        <ChangeCircleIcon />
      </IconButton>

      <IconButton onClick={handleInviteDelete} disabled={!inviteCode}>
        <CancelIcon />
      </IconButton>
    </Box>
  );
}
