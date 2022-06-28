import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Main from "./components/Main";
import Welcome from "./components/Welcome";
import { Register, Login } from "./components/LoginRegister";
import NotFoundError from "./components/NotFoundError";

export default function App(props) {
  const auth = useAuth();
  const loggedIn = auth.user ? true : false;

  if (auth.loading) {
    return <div>Loading app</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<NotFoundError />} />
      </Routes>
    </>
  );
}
