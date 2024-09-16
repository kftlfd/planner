import { FC, ReactNode } from "react";

import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";

export const SimpleModal: FC<{
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  content?: string;
  action?: string;
  loading?: boolean;
}> = ({ open, onConfirm, onClose, title, content, action, loading }) => (
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
      <Button
        onClick={onConfirm}
        color={"error"}
        startIcon={loading ? <CircularProgress size={20} /> : null}
        disabled={loading}
      >
        {action}
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
);

export const InputModal: FC<{
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  content?: string | null;
  action: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputValue?: string;
  inputChange?: (value: string) => void;
  formChildren?: ReactNode;
  actionsChildren?: ReactNode;
  loading: boolean;
}> = ({
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
  loading,
}) => (
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
          onChange={(e) => inputChange?.(e.target.value)}
          disabled={loading}
          fullWidth
          autoFocus
        />
        {formChildren}
      </form>
    </DialogContent>

    <DialogActions>
      {actionsChildren}
      <Button
        onClick={onConfirm}
        disabled={!inputValue || loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {action}
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
);
