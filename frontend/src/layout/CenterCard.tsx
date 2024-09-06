import { FC, ReactNode } from "react";

import { Card, CardProps, Container, ContainerProps } from "@mui/material";

export const CenterCard: FC<{
  ContainerWidth?: ContainerProps["maxWidth"];
  sx?: ContainerProps["sx"];
  cardSx?: CardProps["sx"];
  children?: ReactNode;
}> = (props) => (
  <Container
    maxWidth={props.ContainerWidth || "xs"}
    sx={{ marginBlock: "5rem", ...props.sx }}
  >
    <Card sx={{ padding: "3rem", ...props.cardSx }}>{props.children}</Card>
  </Container>
);
