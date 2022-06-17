import React from "react";
import { Route, Routes } from "react-router-dom";
import ProvideAuth from "./auth";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import { Register, Login } from "./components/LoginRegister";
import "./App.scss";

export default function App(props) {
  return (
    <ProvideAuth>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </ProvideAuth>
  );
}
