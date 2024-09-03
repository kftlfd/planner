import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Link as RouterLink,
  Navigate,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import {
  TextField,
  Button,
  Link,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import { useActions } from "app/context/ActionsContext";
import { selectUser } from "app/store/usersSlice";
import { CenterCard } from "app/layout/CenterCard";

import * as Styled from "./auth.styled";

const Register: React.FC = () => {
  const actions = useActions();
  const user = useSelector(selectUser);

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [state, setState] = useState<{
    loggedIn: boolean;
    loading: boolean;
    success: boolean;
    error: boolean;
    errorMsg: string | null;
    errorStatus: number | null;
    formErrors: { [fieldName: string]: string };
  }>({
    loggedIn: user ? true : false,
    loading: false,
    success: false,
    error: false,
    errorMsg: null,
    errorStatus: null,
    formErrors: {},
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  const handleRegister: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    if (!formRef.current) return;

    setState((prev) => ({ ...prev, loading: true }));
    const formData = new FormData(formRef.current);
    const resp = await actions.auth.register(formData);
    if (!resp) {
      setState((prev) => ({ ...prev, loading: false, success: true }));
      setTimeout(() => navigate(searchParams.get("next") || "/project/"), 1000);
    } else {
      console.error(resp);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: true,
        errorMsg: resp.error,
        errorStatus: resp.status,
        formErrors: resp.formErrors,
      }));
    }
  };

  if (state.loggedIn) {
    return <Navigate to={searchParams.get("next") || "/"} />;
  }

  return (
    <CenterCard>
      <Styled.Heading>Sign Up</Styled.Heading>

      <Styled.Form ref={formRef} onSubmit={handleRegister}>
        <TextField
          name="username"
          type="text"
          label="Username"
          variant="filled"
          size="small"
          error={state.formErrors.hasOwnProperty("username")}
          helperText={state.formErrors.username}
        />
        <TextField
          name="password1"
          type="password"
          label="Password"
          variant="filled"
          size="small"
          error={state.formErrors.hasOwnProperty("password1")}
          helperText={state.formErrors.password1}
        />
        <TextField
          name="password2"
          type="password"
          label="Confirm Password"
          variant="filled"
          size="small"
          error={state.formErrors.hasOwnProperty("password2")}
          helperText={state.formErrors.password2}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={state.loading}
          color={state.success ? "success" : "primary"}
          endIcon={state.success ? <CheckIcon /> : null}
          sx={{ position: "relative" }}
        >
          Sign Up
          {state.loading && (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          )}
        </Button>

        {state.error && state.errorStatus && state.errorStatus !== 406 && (
          <Alert severity="warning">{errorMessages[state.errorStatus]}</Alert>
        )}

        <Link
          component={RouterLink}
          variant="subtitle1"
          underline="hover"
          to={"/login" + location.search}
        >
          Already have an account? Log In
        </Link>
      </Styled.Form>
    </CenterCard>
  );
};

const errorMessages: Record<number, JSX.Element> = {
  504: (
    <>
      <AlertTitle>Can't connect to server</AlertTitle>
      Please try again later.
    </>
  ),
  500: (
    <>
      <AlertTitle>Failed to register</AlertTitle>
      Please try again later.
    </>
  ),
  403: (
    <>
      <AlertTitle>Cookies are required</AlertTitle>
      Please enable cookies.
    </>
  ),
  400: (
    <>
      <AlertTitle>Error</AlertTitle>
    </>
  ),
};

export default Register;
