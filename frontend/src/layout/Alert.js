import React from "react";

import { Modal, Box, Alert, AlertTitle } from "@mui/material";

export function ErrorAlert(props) {
  const { open, toggle, message } = props;

  return (
    <Modal
      open={open}
      componentsProps={{
        backdrop: { sx: { backgroundColor: "rgba(0, 0, 0, 0.2)" } },
      }}
    >
      <Box
        sx={{
          maxWidth: "sm",
          margin: "auto",
          padding: "3rem 1rem",
          outline: "none",
        }}
      >
        <Alert severity="error" onClose={() => toggle()}>
          <AlertTitle>Error</AlertTitle>
          {message}
        </Alert>
      </Box>
    </Modal>
  );
}
