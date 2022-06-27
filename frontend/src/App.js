import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./auth";
import Main from "./components/Main";
import Welcome from "./components/Welcome";
import { Register, Login } from "./components/LoginRegister";

export default function App(props) {
  const auth = useAuth();
  const loggedIn = auth.user ? true : false;

  if (auth.loading) {
    return <div>Loading app</div>;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={loggedIn ? <Main /> : <Navigate to="/welcome" />}
        />
        <Route path="/welcome" element={<Welcome />} />
        <Route
          path="/register"
          element={loggedIn ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/login"
          element={loggedIn ? <Navigate to="/" /> : <Login />}
        />
        <Route path="/*" element={<div>404 not found</div>} />
      </Routes>
    </>
  );
}
