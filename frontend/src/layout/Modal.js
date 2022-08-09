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
    inputLabel,
    inputPlaceholder,
    inputValue,
    inputChange,
    formChildren,
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
          paddingBottom: "0.5rem",
        }}
      >
        {title}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          paddingBlock: "0.5rem",
          ".MuiDialogTitle-root + &": { paddingTop: "0.5rem" },
        }}
      >
        {content && (
          <DialogContentText sx={{ marginBottom: "1rem" }}>
            {content}
          </DialogContentText>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputValue) onConfirm();
          }}
        >
          <TextField
            label={inputLabel}
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={inputChange}
            fullWidth
            autoFocus
          />
          {formChildren}
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
