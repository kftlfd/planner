import React from "react";
import styled from "@emotion/styled";
import { Typography } from "@mui/material";

type Props = { children?: React.ReactNode };

export const Heading: React.FC<Props> = ({ children }) => (
  <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
    {children}
  </Typography>
);

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
