import React from "react";
import { Box, TextField, IconButton, Collapse, BoxProps } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateTimePicker } from "@mui/x-date-pickers";

type DueFormProps = {
  value: Date | null;
  onChange: (value: any, keyboardInputValue?: string | undefined) => void;
  onClear: () => void;
  disabled?: boolean;
  mt?: boolean;
};

export const DueForm: React.FC<DueFormProps> = ({
  value,
  onChange,
  onClear,
  mt,
  disabled,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      ...(mt && { marginTop: "1rem" }),
    }}
  >
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDateTimePicker
        label={"Due"}
        value={value}
        ampm={false}
        onChange={onChange}
        renderInput={(params) => <TextField {...params} sx={{ flexGrow: 1 }} />}
        disabled={disabled}
      />
    </LocalizationProvider>

    <Collapse in={value !== null} orientation="horizontal">
      <IconButton
        disabled={value === null || disabled}
        onClick={onClear}
        sx={{ marginLeft: "0.5rem" }}
      >
        <CancelIcon />
      </IconButton>
    </Collapse>
  </Box>
);
