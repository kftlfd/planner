import { FC, ReactNode } from "react";
import styled from "@emotion/styled";

import { Typography } from "@mui/material";

type Props = { children?: ReactNode };

export const Heading: FC<Props> = ({ children }) => (
  <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
    {children}
  </Typography>
);

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
