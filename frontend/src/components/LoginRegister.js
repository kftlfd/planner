import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Navbar from "./Navbar";

export function Register(props) {
  const auth = useAuth();
  const [formResponse, setFormResponse] = useState(null);
  const redirect = useNavigate();

  const loggedIn = auth.user ? true : false;
  if (loggedIn) {
    return <Navigate to="/" />;
  }

  function sendRegisterForm(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    auth.register(formData).then((res) => {
      setFormResponse(res);
      if (res.success) {
        setTimeout(() => {
          redirect("/");
        }, 2000);
      } else {
        console.error("sendRegisterForm", res);
      }
    });
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="xs">
        <h1>Sign Up</h1>
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
          <Link to="/login">Already have an account? Sign In</Link>
        </form>
      </Container>
    </>
  );
}

export function Login() {
  const auth = useAuth();
  const [formResponse, setFormResponse] = useState(null);
  const redirect = useNavigate();

  const loggedIn = auth.user ? true : false;
  if (loggedIn) {
    return <Navigate to="/" />;
  }

  function sendLoginForm(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    auth.login(formData).then((res) => {
      setFormResponse(res);
      if (res.success) {
        setTimeout(() => {
          redirect("/");
        }, 1000);
      } else {
        console.error("sendLoginForm", res);
      }
    });
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="xs">
        <h1>Sign In</h1>
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
            {formResponse?.success ? "Signed In" : "Sign In"}
          </Button>
          {formResponse?.serverError && (
            // can't connect to server
            <Alert severity="warning">
              <AlertTitle>Server Error</AlertTitle>
              {formResponse.serverError}
            </Alert>
          )}
          <Link to="/register">Don't have an account? Sign Up</Link>
        </form>
      </Container>
    </>
  );
}
