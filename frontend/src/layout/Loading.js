import React from "react";

import { Main } from "./Main";
import { CenterCard } from "./CenterCard";

import { Skeleton, Box, Typography, LinearProgress } from "@mui/material";

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

function FaviconSVG(props) {
  // a Memo emoji by Twemoji
  // https://twemoji.twitter.com/
  // https://github.com/twitter/twemoji
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      height={"12rem"}
    >
      <path
        fill="#CCD6DD"
        d="M31 32c0 2.209-1.791 4-4 4H5c-2.209 0-4-1.791-4-4V4c0-2.209 1.791-4 4-4h22c2.209 0 4 1.791 4 4v28z"
      />
      <path
        fill="#99AAB5"
        d="M27 24c0 .553-.447 1-1 1H6c-.552 0-1-.447-1-1 0-.553.448-1 1-1h20c.553 0 1 .447 1 1zm-16 4c0 .553-.448 1-1 1H6c-.552 0-1-.447-1-1 0-.553.448-1 1-1h4c.552 0 1 .447 1 1zM27 8c0 .552-.447 1-1 1H6c-.552 0-1-.448-1-1s.448-1 1-1h20c.553 0 1 .448 1 1zm0 4c0 .553-.447 1-1 1H6c-.552 0-1-.447-1-1 0-.553.448-1 1-1h20c.553 0 1 .447 1 1zm0 4c0 .553-.447 1-1 1H6c-.552 0-1-.447-1-1 0-.553.448-1 1-1h20c.553 0 1 .447 1 1zm0 4c0 .553-.447 1-1 1H6c-.552 0-1-.447-1-1 0-.553.448-1 1-1h20c.553 0 1 .447 1 1z"
      />
      <path
        fill="#66757F"
        d="M31 6.272c-.827-.535-1.837-.579-2.521-.023l-.792.646-1.484 1.211-.1.08-2.376 1.938-11.878 9.686c-.437.357-.793 1.219-1.173 2.074-.378.85-.969 2.852-1.443 4.391-.148.25-1.065 1.846-.551 2.453.52.615 2.326.01 2.568-.076 1.626-.174 3.731-.373 4.648-.58.924-.211 1.854-.395 2.291-.752.008-.006.01-.018.017-.023l11.858-9.666.792-.646.144-.118V6.272z"
      />
      <path
        fill="#D99E82"
        d="M18.145 22.526s-1.274-1.881-2.117-2.553c-.672-.843-2.549-2.116-2.549-2.116-.448-.446-1.191-.48-1.629-.043-.437.438-.793 1.366-1.173 2.291-.472 1.146-1.276 4.154-1.768 5.752-.083.272.517-.45.503-.21-.01.187.027.394.074.581l-.146.159.208.067c.025.082.05.154.068.21l.159-.146c.187.047.394.084.58.074.24-.014-.483.587-.21.503 1.598-.493 4.607-1.296 5.752-1.768.924-.381 1.854-.736 2.291-1.174.439-.435.406-1.178-.043-1.627z"
      />
      <path
        fill="#EA596E"
        d="M25.312 4.351c-.876.875-.876 2.293 0 3.168l3.167 3.168c.876.874 2.294.874 3.168 0l3.169-3.168c.874-.875.874-2.293 0-3.168l-3.169-3.168c-.874-.875-2.292-.875-3.168 0l-3.167 3.168z"
      />
      <path
        fill="#FFCC4D"
        d="M11.849 17.815l3.17 3.17 3.165 3.166 11.881-11.879-6.337-6.336-11.879 11.879z"
      />
      <path
        fill="#292F33"
        d="M11.298 26.742s-2.06 1.133-2.616.576c-.557-.558.581-2.611.581-2.611s1.951.036 2.035 2.035z"
      />
      <path fill="#CCD6DD" d="M23.728 5.935l3.96-3.96 6.336 6.337-3.96 3.96z" />
      <path
        fill="#99AAB5"
        d="M26.103 3.558l.792-.792 6.336 6.335-.792.792zM24.52 5.142l.791-.791 6.336 6.335-.792.792z"
      />
    </svg>
  );
}

export function SplashScreen(props) {
  const { message } = props;

  return (
    <Main>
      <CenterCard
        sx={{ display: "grid", alignContent: "center" }}
        cardSx={{ display: "grid", placeContent: "center", gap: "1rem" }}
      >
        <Box sx={{ textAlign: "center" }}>
          <FaviconSVG />
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
