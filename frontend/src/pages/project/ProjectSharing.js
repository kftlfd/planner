import React, { useState } from "react";

import { SidebarHeader, SidebarBody } from "../../layout/Sidebar";

import {
  Typography,
  Button,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

export function ProjectSharing(props) {
  const { projectSharing, projectSharingToggle, toggleSidebar } = props;

  const [stopSharingDialogOpen, setStopSharingDialogOpen] = useState(false);
  const stopSharingDialogToggle = () => setStopSharingDialogOpen((x) => !x);

  return (
    <>
      <SidebarHeader title="Project sharing" toggle={toggleSidebar}>
        <SharingSwitch
          checked={projectSharing}
          onChange={
            projectSharing ? stopSharingDialogToggle : projectSharingToggle
          }
        />
      </SidebarHeader>

      <SidebarBody>
        {!projectSharing ? (
          <Typography
            variant="h5"
            align="center"
            sx={{ marginTop: "1rem", fontWeight: "fontWeightLight" }}
          >
            Sharing is Off
          </Typography>
        ) : (
          <Typography>Sharing is on</Typography>
        )}
      </SidebarBody>

      <StopSharingDialog
        open={stopSharingDialogOpen}
        onClose={stopSharingDialogToggle}
        onConfirm={projectSharingToggle}
      />
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

function StopSharingDialog(props) {
  const { open, onClose, onConfirm } = props;

  function handleConfirm() {
    onConfirm();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Stop sharing project?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          It will do something unreversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color="error">
          Stop sharing
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
