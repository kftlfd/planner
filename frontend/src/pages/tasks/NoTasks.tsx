import React from "react";
import { Typography, styled } from "@mui/material";

export const NoTasks: React.FC = () => {
  return (
    <Heading variant="h4" align="center">
      No tasks
    </Heading>
  );
};

const Heading = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(6),
  fontWeight: theme.typography.fontWeightLight,
  color: theme.palette.text.primary,
}));
