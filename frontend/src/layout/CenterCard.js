import React from "react";
import { Box, Container, Card } from "@mui/material";

export function CenterCard(props) {
  return (
    <Container
      maxWidth={props.ContainerWidth || "xs"}
      sx={{ marginBlock: "5rem", ...props.sx }}
    >
      <Card sx={{ padding: "3rem" }}>{props.children}</Card>
    </Container>
  );
}
