import { FC } from "react";

import { Alert, AlertTitle, Box, Modal } from "@mui/material";

export const ErrorAlert: FC<{
  open: boolean;
  toggle: () => void;
  message?: string | null;
}> = ({ open, toggle, message }) => (
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
      <Alert severity="error" onClose={toggle}>
        <AlertTitle>Error</AlertTitle>
        {message}
      </Alert>
    </Box>
  </Modal>
);
