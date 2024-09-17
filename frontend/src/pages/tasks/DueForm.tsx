import { FC } from "react";

import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Collapse, IconButton, TextField } from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export const DueForm: FC<{
  value: Date | null;
  onChange: (value: Date | null, keyboardInputValue?: string) => void;
  onClear: () => void;
  disabled?: boolean;
  mt?: boolean;
}> = ({ value, onChange, onClear, mt, disabled }) => (
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
