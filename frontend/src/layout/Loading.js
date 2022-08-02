import React from "react";

import { Skeleton } from "@mui/material";

export function BaseSkeleton(props) {
  return (
    <Skeleton
      width={props.width}
      height={props.height}
      variant="rectangular"
      animation="wave"
      sx={{
        borderRadius: "0.25rem",
        ...props.sx,
      }}
    />
  );
}
