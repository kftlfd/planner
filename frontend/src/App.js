import React from "react";
import { Route, Routes } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import ProvideTheme from "./context/ThemeContext";

import { LoadingApp } from "./components/Loading";
import Home from "./pages/home/Home";
import Project from "./pages/project/Project";
import Tasks from "./pages/tasks/Tasks";

import Navbar from "./layout/Navbar";
import Welcome from "./pages/Welcome";
import { Register, Login } from "./pages/Auth";
import Error from "./pages/Error";

export default function App() {
  const auth = useAuth();

  return (
    <ProvideTheme>
      {auth.loading ? (
        <LoadingApp />
      ) : (
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="project" element={<Project />}>
              <Route path=":projectId" element={<Tasks />} />
            </Route>
          </Route>
          <Route path="/" element={<Navbar />}>
            <Route path="welcome" element={<Welcome />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      )}
    </ProvideTheme>
  );
}
