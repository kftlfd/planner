import { FC } from "react";

import {
  Box,
  CircularProgress,
  LinearProgress,
  Skeleton,
  SkeletonProps,
  Typography,
} from "@mui/material";

import { CenterCard } from "./CenterCard";
import { Logo } from "./Logo";
import { Main } from "./Main";

export const BaseSkeleton: FC<SkeletonProps> = (props) => (
  <Skeleton
    variant="rectangular"
    animation="wave"
    {...props}
    sx={{
      borderRadius: "0.25rem",
      ...props.sx,
    }}
  />
);

export const SplashScreen: FC<{ message?: string }> = ({ message }) => (
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

export const LoadingSpinner: FC<{
  size?: number;
}> = ({ size = 200 }) => (
  <Box
    sx={{
      paddingBlock: "2rem",
      flexGrow: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <CircularProgress size={size} />
  </Box>
);
