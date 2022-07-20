import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { selectProjectById, updateProject } from "../../store/projectsSlice";

import * as api from "../../api/client";

import { Sidebar, SidebarHeader, SidebarBody } from "../../layout/Sidebar";
import { MenuListItem } from "./ProjectOprionsMenu";
import { ProjectStopSharingModal } from "./ProjectModals";

import {
  Typography,
  Box,
  IconButton,
  Switch,
  MenuItem,
  Checkbox,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export function ProjectSharing(props) {
  const { closeOptionsMenu } = props;
  const { projectId } = useParams();
  const project = useSelector(selectProjectById(projectId));
  const dispatch = useDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    if (!sidebarOpen) closeOptionsMenu();
    setSidebarOpen((x) => !x);
  };

  const [projectSharing, setProjectSharing] = useState(project.sharing);
  const projectSharingToggle = () => {
    if (projectSharing) {
      api.projects.sharing
        .disable(projectId)
        .then((res) => {
          dispatch(updateProject(res));
        })
        .catch((err) => console.error("Failed to stop sharing: ", err));
    } else {
      api.projects.sharing
        .enable(projectId)
        .then((res) => {
          dispatch(updateProject(res));
        })
        .catch((err) => console.error("Failed to start sharing: ", err));
    }
    setProjectSharing(!projectSharing);
    stopSharingDialogToggle();
  };

  const [stopSharingDialogOpen, setStopSharingDialogOpen] = useState(false);
  const stopSharingDialogToggle = () => setStopSharingDialogOpen((x) => !x);

  const sharingDisabled = (
    <Typography
      variant="h5"
      align="center"
      sx={{ marginTop: "1rem", fontWeight: "fontWeightLight" }}
    >
      Sharing is Off
    </Typography>
  );

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
              projectSharing ? stopSharingDialogToggle : projectSharingToggle
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
                <div>{member}</div>
              ))}
            </>
          )}
        </SidebarBody>

        <ProjectStopSharingModal
          open={stopSharingDialogOpen}
          onClose={stopSharingDialogToggle}
          onConfirm={projectSharingToggle}
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
  const dispatch = useDispatch();
  const inviteLink = `${window.location.origin}/invite/${inviteCode}`;

  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  function copyInviteLinkToClipboard() {
    navigator.clipboard.writeText(inviteLink);
    setTooltipOpen(true);
    setTimeout(() => setTooltipOpen(false), 3000);
  }

  function handleInviteRecreate() {
    api.projects.invite
      .recreate(projectId)
      .then((res) => dispatch(updateProject(res)))
      .catch((err) => console.error("Invite recreate: ", err));
  }

  function handleInviteDelete() {
    api.projects.invite
      .delete(projectId)
      .then((res) => dispatch(updateProject(res)))
      .catch((err) => console.error("Invite delete: ", err));
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
        <Box
          sx={{
            position: "relative",
            flexGrow: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.5rem",
            paddingInline: "0.5rem",
            paddingBlock: "0.2rem",

            backgroundColor: "#fcfcfc",
            border: "1px solid #eee",
            borderRadius: "0.5rem",
            overflow: "hidden",
          }}
        >
          {inviteCode ? (
            <Box
              onClick={copyInviteLinkToClipboard}
              sx={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                direction: "rtl",
                userSelect: "all",
                color: "#0072E5",
              }}
            >
              {inviteLink}
            </Box>
          ) : (
            <Box sx={{ opacity: 0.5 }}>Disabled</Box>
          )}

          <Tooltip title="Copy link to clipboard">
            <IconButton
              onClick={copyInviteLinkToClipboard}
              disabled={!inviteCode}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Tooltip>

      <Tooltip title="Create new link">
        <IconButton onClick={handleInviteRecreate}>
          <ChangeCircleIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Remove link">
        <IconButton onClick={handleInviteDelete} disabled={!inviteCode}>
          <CancelIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
