import React from "react";
import { Box, Container, Card, ContainerProps, CardProps } from "@mui/material";

export function CenterCard(props: {
  ContainerWidth?: ContainerProps["maxWidth"];
  sx?: ContainerProps["sx"];
  cardSx?: CardProps["sx"];
  children?: React.ReactNode;
}) {
  return (
    <Container
      maxWidth={props.ContainerWidth || "xs"}
      sx={{ marginBlock: "5rem", ...props.sx }}
    >
      <Card sx={{ padding: "3rem", ...props.cardSx }}>{props.children}</Card>
    </Container>
  );
}
