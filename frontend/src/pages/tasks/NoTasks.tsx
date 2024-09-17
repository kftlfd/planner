import { FC } from "react";

import { styled, Typography } from "@mui/material";

export const NoTasks: FC = () => (
  <Heading variant="h4" align="center">
    No tasks
  </Heading>
);

const Heading = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(6),
  fontWeight: theme.typography.fontWeightLight,
  color: theme.palette.text.primary,
}));
