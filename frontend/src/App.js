import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./auth";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import { Register, Login } from "./components/LoginRegister";
import "./App.scss";

export default function App(props) {
  const auth = useAuth();
  const notLoggedIn = auth.user ? false : true;

  if (auth.loading) {
    return <div>Loading app</div>;
  }

  if (notLoggedIn) {
    return (
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<div>404 not found</div>} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<Navigate to="/" />} />
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="/*" element={<div>404 not found</div>} />
      </Routes>
    </>
  );
}
