import React, { useState } from "react";
import {
  Link as RouterLink,
  Navigate,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useSelector } from "react-redux";

import { useActions } from "../context/ActionsContext";
import { selectUser, setUser } from "../store/usersSlice";
import { CenterCard } from "../layout/CenterCard";

import {
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const AuthFormStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

export function Register() {
  const actions = useActions();
  const user = useSelector(selectUser);

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [state, setState] = useState({
    loggedIn: user ? true : false,
    loading: false,
    success: false,
    error: false,
    errorMsg: null,
    errorStatus: null,
    formErrors: {},
  });

  async function handleRegister(event) {
    event.preventDefault();
    setState((prev) => ({ ...prev, loading: true }));
    let formData = new FormData(event.target);
    let resp = await actions.user.register(formData);
    if (!resp) {
      setState((prev) => ({ ...prev, loading: false, success: true }));
      setTimeout(() => navigate(searchParams.get("next") || "/project/"), 1000);
    } else {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: true,
        errorMsg: resp.error,
        errorStatus: resp.status,
        formErrors: resp.formErrors,
      }));
    }
  }

  if (state.loggedIn) {
    return <Navigate to={searchParams.get("next") || "/"} />;
  }

  return (
    <CenterCard>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        Sign Up
      </Typography>

      <form style={AuthFormStyle} onSubmit={handleRegister}>
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

        {state.error && state.errorStatus !== 406 && (
          <Alert severity="warning">
            {state.errorStatus === 504 && (
              <>
                <AlertTitle>Can't connect to server</AlertTitle>
                Please try again later.
              </>
            )}
            {state.errorStatus === 500 && (
              <>
                <AlertTitle>Failed to register</AlertTitle>
                Please try again later.
              </>
            )}
            {state.errorStatus === 403 && (
              <>
                <AlertTitle>Cookies are required</AlertTitle>
                Please enable cookies.
              </>
            )}
            {state.errorStatus === 400 && (
              <>
                <AlertTitle>{state.errorMsg}</AlertTitle>
              </>
            )}
          </Alert>
        )}

        <Link
          component={RouterLink}
          variant="subtitle1"
          underline="hover"
          to={"/login" + location.search}
        >
          Already have an account? Log In
        </Link>
      </form>
    </CenterCard>
  );
}

export function Login() {
  const actions = useActions();
  const user = useSelector(selectUser);

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [state, setState] = useState({
    loggedIn: user ? true : false,
    loading: false,
    success: false,
    error: false,
    errorMsg: null,
    errorStatus: null,
  });

  async function handleLogin(event) {
    event.preventDefault();
    setState((prev) => ({ ...prev, loading: true }));
    let formData = new FormData(event.target);
    let resp = await actions.user.login(formData);
    if (!resp) {
      setState((prev) => ({ ...prev, loading: false, success: true }));
      setTimeout(() => navigate(searchParams.get("next") || "/project/"), 1000);
    } else {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: true,
        errorMsg: resp.error,
        errorStatus: resp.status,
      }));
    }
  }

  if (state.loggedIn) {
    return <Navigate to={searchParams.get("next") || "/project/"} />;
  }

  return (
    <CenterCard>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        Log In
      </Typography>

      <form style={AuthFormStyle} onSubmit={handleLogin}>
        <TextField
          name="username"
          type="text"
          label="Username"
          variant="filled"
          size="small"
          fullWidth={true}
          autoComplete="false"
          error={state.error}
        />
        <TextField
          name="password"
          type="password"
          label="Password"
          variant="filled"
          size="small"
          fullWidth={true}
          error={state.error}
          helperText={state.errorStatus === 404 ? state.errorMsg : null}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={state.loading}
          color={state.success ? "success" : "primary"}
          endIcon={state.success ? <CheckIcon /> : null}
          sx={{ position: "relative" }}
        >
          Log In
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

        {state.error && state.errorStatus !== 404 && (
          <Alert severity="warning">
            <AlertTitle>{state.errorMsg}</AlertTitle>
          </Alert>
        )}

        <Link
          component={RouterLink}
          variant="subtitle1"
          underline="hover"
          to={"/register" + location.search}
        >
          Don't have an account? Sign Up
        </Link>
      </form>
    </CenterCard>
  );
}
