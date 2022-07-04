import React from "react";
import { Route, Routes } from "react-router-dom";

import { useAuth } from "./AuthContext";
import ProvideProjects from "./ProjectsContext";
import Main from "./components/Main";
import ProjectHeader from "./components/ProjectHeader";
import ProjectTasks from "./components/ProjectTasks";
import Welcome from "./components/Welcome";
import { Register, Login } from "./components/LoginRegister";
import NotFoundError from "./components/NotFoundError";
import ProvideTheme from "./Theme";

export default function App() {
  const auth = useAuth();

  if (auth.loading) {
    return <div>Loading app</div>;
  }

  return (
    <ProvideTheme>
      <ProvideProjects>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route path="project" element={<ProjectHeader />}>
              <Route path=":projectId" element={<ProjectTasks />} />
            </Route>
          </Route>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<NotFoundError />} />
        </Routes>
      </ProvideProjects>
    </ProvideTheme>
  );
}
