import { FC, FormEventHandler, ReactNode, useRef, useState } from "react";
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

const hasProperty = (obj: object, key: string) =>
  Object.prototype.hasOwnProperty.call(obj, key);

const Register: FC = () => {
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
    formErrors: Record<string, string | undefined>;
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

  const handleRegister = async () => {
    if (!formRef.current) return;

    setState((prev) => ({ ...prev, loading: true }));
    const formData = new FormData(formRef.current);
    const resp = await actions.auth.register(formData);
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
        formErrors: resp.formErrors ?? {},
      }));
    }
  };

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    handleRegister().catch((err: unknown) => {
      console.error(err);
    });
  };

  if (state.loggedIn) {
    return <Navigate to={searchParams.get("next") || "/"} />;
  }

  return (
    <CenterCard>
      <Styled.Heading>Sign Up</Styled.Heading>

      <Styled.Form ref={formRef} onSubmit={onSubmit}>
        <TextField
          name="username"
          type="text"
          label="Username"
          variant="filled"
          size="small"
          error={hasProperty(state.formErrors, "username")}
          helperText={state.formErrors.username}
        />
        <TextField
          name="password1"
          type="password"
          label="Password"
          variant="filled"
          size="small"
          error={hasProperty(state.formErrors, "password1")}
          helperText={state.formErrors.password1}
        />
        <TextField
          name="password2"
          type="password"
          label="Confirm Password"
          variant="filled"
          size="small"
          error={hasProperty(state.formErrors, "password2")}
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

const errorMessages: Record<number, ReactNode> = {
  504: (
    <>
      <AlertTitle>Can&apos;t connect to server</AlertTitle>
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
