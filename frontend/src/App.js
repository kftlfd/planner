import React from "react";
import { Route, Routes } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "./store/projectsSlice";

import { useAuth } from "./context/AuthContext";

import LoadingApp from "./pages/Loading";
import Home from "./pages/home/Home";
import Project from "./pages/project/Project";
import Tasks from "./pages/tasks/Tasks";
import Navbar from "./layout/Navbar";
import Invite from "./pages/Invite";
import Welcome from "./pages/Welcome";
import { Register, Login } from "./pages/Auth";
import Error from "./pages/Error";

export default function App() {
  const auth = useAuth();

  const dispatch = useDispatch();
  const projectsStatus = useSelector((state) => state.projects.status);
  const loadingProjects =
    projectsStatus === "idle" || projectsStatus === "loading";

  React.useEffect(() => {
    if (auth.user && loadingProjects) {
      dispatch(fetchProjects(auth.user.id)());
    }
  }, [auth.user]);

  if (auth.loading) {
    return <LoadingApp />;
  }

  if (auth.user && loadingProjects) {
    return <LoadingApp message={"Loading projects"} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="project" element={<Project />}>
          <Route path=":projectId" element={<Tasks />} />
        </Route>
      </Route>
      <Route path="/" element={<Navbar />}>
        <Route path="invite/:inviteCode" element={<Invite />} />
        <Route path="welcome" element={<Welcome />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Error />} />
      </Route>
    </Routes>
  );
}
