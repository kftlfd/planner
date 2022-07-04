import React from "react";
import { Route, Routes } from "react-router-dom";

import { useAuth } from "./AuthContext";
import ProvideProjects from "./ProjectsContext";
import Main from "./components/Main";
import Project from "./components/Project";
import ProjectTasks from "./components/ProjectTasks";
import Welcome from "./components/Welcome";
import { Register, Login } from "./components/LoginRegister";
import NotFoundError from "./components/NotFoundError";
import ProvideTheme from "./Theme";
import LoadingApp from "./components/Loading";

export default function App() {
  const auth = useAuth();

  return (
    <ProvideTheme>
      {auth.loading ? (
        <LoadingApp />
      ) : (
        <ProvideProjects>
          <Routes>
            <Route path="/" element={<Main />}>
              <Route path="project" element={<Project />}>
                <Route path=":projectId" element={<ProjectTasks />} />
              </Route>
            </Route>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<NotFoundError />} />
          </Routes>
        </ProvideProjects>
      )}
    </ProvideTheme>
  );
}
