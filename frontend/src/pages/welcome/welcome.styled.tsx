import React from "react";
import { Box, Typography } from "@mui/material";

type Props = { children?: React.ReactNode };

export const Wrapper: React.FC<Props> = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column-reverse", sm: "row" },
      justifyContent: { xs: "center", sm: "space-between" },
      alignItems: { xs: "center", sm: "start" },
      gap: "1.5rem",
    }}
  >
    {children}
  </Box>
);

export const WrapperInner: React.FC<Props> = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: { xs: "center", sm: "start" },
      gap: "1rem",
    }}
  >
    {children}
  </Box>
);

export const HeadingTitle: React.FC<Props> = ({ children }) => (
  <Typography variant="h2">{children}</Typography>
);

export const HeadingSubtitle: React.FC<Props> = ({ children }) => (
  <Typography variant="h5" sx={{ textAlign: { xs: "center", sm: "left" } }}>
    {children}
  </Typography>
);

export const ButtonsWrapper: React.FC<Props> = ({ children }) => (
  <Box sx={{ display: "flex", gap: "1rem" }}>{children}</Box>
);
