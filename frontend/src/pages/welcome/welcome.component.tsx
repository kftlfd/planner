import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Link } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { CenterCard } from "app/layout/CenterCard";
import { Logo } from "app/layout/Logo";

import * as Styled from "./welcome.styled";

export const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <CenterCard ContainerWidth="md">
      <Styled.Wrapper>
        <Styled.WrapperInner>
          <Styled.HeadingTitle>Planner</Styled.HeadingTitle>
          <Styled.HeadingSubtitle>
            Task tracking with real-time collaboration
          </Styled.HeadingSubtitle>

          <Link
            href="https://www.youtube.com/watch?v=1GzO4nYecYU"
            target="_blank"
            rel="noreferrer"
            underline="none"
          >
            <Button endIcon={<OpenInNewIcon />}>Watch demo on YouTube</Button>
          </Link>

          <Styled.ButtonsWrapper>
            <Button variant="contained" onClick={() => navigate("/register")}>
              Sign Up
            </Button>
            <Button variant="outlined" onClick={() => navigate("/login")}>
              Log In
            </Button>
          </Styled.ButtonsWrapper>
        </Styled.WrapperInner>

        <Logo height={190} />
      </Styled.Wrapper>
    </CenterCard>
  );
};
