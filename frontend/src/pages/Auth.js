import React, { useState } from "react";
import {
  Link as RouterLink,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { CenterCard } from "../layout/CenterCard";

import {
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  AlertTitle,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

export function Register() {
  const auth = useAuth();
  const [formResponse, setFormResponse] = useState(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (auth.user) {
      navigate(searchParams.get("next") || "/");
    }
  }, []);

  function sendRegisterForm(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    auth.register(formData).then((res) => {
      setFormResponse(res);
      if (res.success) {
        setTimeout(() => {
          navigate(searchParams.get("next") || "/");
        }, 2000);
      } else {
        console.error("sendRegisterForm", res);
      }
    });
  }

  return (
    <CenterCard>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        Sign Up
      </Typography>

      <form className="AuthForm" onSubmit={sendRegisterForm}>
        <TextField
          name="username"
          type="text"
          label="Username"
          variant="filled"
          size="small"
          error={formResponse?.username ? true : false}
          helperText={formResponse?.username}
        />
        <TextField
          name="password1"
          type="password"
          label="Password"
          variant="filled"
          size="small"
          error={formResponse?.password1 ? true : false}
          helperText={formResponse?.password1}
        />
        <TextField
          name="password2"
          type="password"
          label="Confirm Password"
          variant="filled"
          size="small"
          error={formResponse?.password2 ? true : false}
          helperText={formResponse?.password2}
        />
        <Button
          type="submit"
          variant="contained"
          color={formResponse?.success ? "success" : "primary"}
          endIcon={formResponse?.success ? <CheckIcon /> : null}
        >
          {formResponse?.success ? "Sighned Up" : "Sign Up"}
        </Button>

        {formResponse?.serverError && (
          // if can't connect to server
          <Alert severity="warning">
            <AlertTitle>Server Error</AlertTitle>
            {formResponse.serverError}
          </Alert>
        )}

        {formResponse?.error && (
          // if can't create new user
          <Alert severity="warning">
            <AlertTitle>Server Error</AlertTitle>
            {formResponse.error}
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
  const auth = useAuth();
  const [formResponse, setFormResponse] = useState(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (auth.user) {
      navigate(searchParams.get("next") || "/");
    }
  }, []);

  function sendLoginForm(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    auth.login(formData).then((res) => {
      setFormResponse(res);
      if (res.success) {
        setTimeout(() => {
          navigate(searchParams.get("next") || "/");
        }, 1000);
      } else {
        console.error("sendLoginForm", res);
      }
    });
  }

  return (
    <CenterCard>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        Log In
      </Typography>

      <form className="AuthForm" onSubmit={sendLoginForm}>
        <TextField
          name="username"
          type="text"
          label="Username"
          variant="filled"
          size="small"
          fullWidth={true}
          autoComplete="false"
          error={formResponse?.error ? true : false}
        />
        <TextField
          name="password"
          type="password"
          label="Password"
          variant="filled"
          size="small"
          fullWidth={true}
          error={formResponse?.error ? true : false}
          helperText={formResponse?.error}
        />
        <Button
          type="submit"
          variant="contained"
          color={formResponse?.success ? "success" : "primary"}
          endIcon={formResponse?.success ? <CheckIcon /> : null}
        >
          {formResponse?.success ? "Logged In" : "Log In"}
        </Button>

        {formResponse?.serverError && (
          // can't connect to server
          <Alert severity="warning">
            <AlertTitle>Server Error</AlertTitle>
            {formResponse.serverError}
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
