import React from "react";

import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function SimpleModal(props) {
  const { open, onConfirm, onClose, title, content, action } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {title}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color={"error"}>
          {action}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export function InputModal(props) {
  const {
    open,
    onConfirm,
    onClose,
    title,
    content,
    action,
    inputValue,
    inputChange,
    actionsChildren,
  } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {title}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {content && <DialogContentText>{content}</DialogContentText>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputValue) onConfirm();
          }}
        >
          <TextField
            value={inputValue}
            onChange={inputChange}
            fullWidth
            autoFocus
            sx={{ paddingBlock: "1rem" }}
          />
        </form>
      </DialogContent>

      <DialogActions>
        {actionsChildren}
        <Button onClick={onConfirm} disabled={!inputValue}>
          {action}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
