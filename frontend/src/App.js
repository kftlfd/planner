import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { selectLoadingUser, fetchUser, selectUser } from "./store/usersSlice";
import { selectLoadingProjects } from "./store/projectsSlice";
import { useActions } from "./context/ActionsContext";
import { SplashScreen } from "./layout/Loading";
import Home from "./pages/home/Home";
import Project from "./pages/project/Project";
import Tasks from "./pages/tasks/Tasks";
import Navbar from "./layout/Navbar";
import Invite from "./pages/Invite";
import Welcome from "./pages/Welcome";
import { Register, Login } from "./pages/Auth";
import Error from "./pages/Error";

export default function App() {
  const user = useSelector(selectUser);
  const loadingUser = useSelector(selectLoadingUser);
  const loadingProjects = useSelector(selectLoadingProjects);
  const dispatch = useDispatch();
  const actions = useActions();

  React.useEffect(() => {
    dispatch(fetchUser());
  }, []);

  React.useEffect(() => {
    if (user && loadingProjects) {
      actions.project.loadProjects(user.id);
    }
  }, [user, loadingProjects]);

  return React.useMemo(
    () =>
      loadingUser ? (
        <SplashScreen />
      ) : user && loadingProjects ? (
        <SplashScreen message={"Loading projects"} />
      ) : (
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
      ),
    [loadingUser, loadingProjects]
  );
}
