import { FC, FormEventHandler, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Link as RouterLink,
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import CheckIcon from "@mui/icons-material/Check";
import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Link,
  TextField,
} from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { CenterCard } from "~/layout/CenterCard";
import { selectUser } from "~/store/usersSlice";

import * as Styled from "./auth.styled";

const Login: FC = () => {
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
  }>({
    loggedIn: user ? true : false,
    loading: false,
    success: false,
    error: false,
    errorMsg: null,
    errorStatus: null,
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  const handleLogin = async () => {
    if (!formRef.current) return;

    setState((prev) => ({ ...prev, loading: true }));
    const formData = new FormData(formRef.current);
    const resp = await actions.auth.login(formData);
    if (resp.ok) {
      setState((prev) => ({ ...prev, loading: false, success: true }));
      setTimeout(() => {
        navigate(searchParams.get("next") || "/project/");
      }, 1000);
    } else {
      console.error(resp);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: true,
        errorMsg: resp.error ?? null,
        errorStatus: resp.status ?? null,
      }));
    }
  };

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    handleLogin().catch((err: unknown) => {
      console.error(err);
    });
  };

  if (state.loggedIn) {
    return <Navigate to={searchParams.get("next") || "/project/"} />;
  }

  return (
    <CenterCard>
      <Styled.Heading>Log In</Styled.Heading>

      <Styled.Form ref={formRef} onSubmit={onSubmit}>
        <TextField
          name="username"
          type="text"
          label="Username"
          variant="filled"
          size="small"
          fullWidth={true}
          autoComplete="false"
          error={state.error}
          onChange={() => {
            setState((prev) => ({ ...prev, error: false }));
          }}
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
          onChange={() => {
            setState((prev) => ({ ...prev, error: false }));
          }}
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
            <AlertTitle>Connection Error</AlertTitle>
          </Alert>
        )}

        <Link
          component={RouterLink}
          variant="subtitle1"
          underline="hover"
          to={"/register" + location.search}
        >
          Don&apos;t have an account? Sign Up
        </Link>
      </Styled.Form>
    </CenterCard>
  );
};

export default Login;
