import { FC, ReactNode } from "react";

import { Box, Typography } from "@mui/material";

type Props = { children?: ReactNode };

export const Wrapper: FC<Props> = ({ children }) => (
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

export const WrapperInner: FC<Props> = ({ children }) => (
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

export const HeadingTitle: FC<Props> = ({ children }) => (
  <Typography variant="h2">{children}</Typography>
);

export const HeadingSubtitle: FC<Props> = ({ children }) => (
  <Typography variant="h5" sx={{ textAlign: { xs: "center", sm: "left" } }}>
    {children}
  </Typography>
);

export const ButtonsWrapper: FC<Props> = ({ children }) => (
  <Box sx={{ display: "flex", gap: "1rem" }}>{children}</Box>
);
