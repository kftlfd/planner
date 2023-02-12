import React from "react";

import { Main } from "./Main";
import { CenterCard } from "./CenterCard";
import { Logo } from "./Logo";

import {
  Skeleton,
  Box,
  Typography,
  LinearProgress,
  SkeletonProps,
} from "@mui/material";

export function BaseSkeleton(props: SkeletonProps) {
  return (
    <Skeleton
      // width={props.width}
      // height={props.height}
      variant="rectangular"
      animation="wave"
      {...props}
      sx={{
        borderRadius: "0.25rem",
        ...props.sx,
      }}
    />
  );
}

export function SplashScreen(props: { message?: string }) {
  const { message } = props;

  return (
    <Main>
      <CenterCard
        sx={{ display: "grid", alignContent: "center" }}
        cardSx={{ display: "grid", placeContent: "center", gap: "1rem" }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Logo height={220} />
        </Box>

        <Typography
          component="div"
          sx={{
            height: "2rem",
            textAlign: "center",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          {message}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <LinearProgress sx={{ width: { xs: "10rem", sm: "14rem" } }} />
        </Box>
      </CenterCard>
    </Main>
  );
}
