import React from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "./auth";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import { Register, Login } from "./components/LoginRegister";
import "./App.scss";

export default function App(props) {
  const auth = useAuth();
  
  if (auth.loading) {
    return(
      <div>Loading app</div>
    )
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<div>404 not found</div>} />
      </Routes>
    </>
  );
}
