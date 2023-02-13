import React from "react";
import { Route, Routes } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "app/store/hooks";
import { selectLoadingUser, fetchUser, selectUser } from "app/store/usersSlice";
import { selectLoadingProjects } from "app/store/projectsSlice";
import { useActions } from "app/context/ActionsContext";
import { SplashScreen } from "app/layout/Loading";
import Home from "app/pages/home/Home";
import Project from "app/pages/project/Project";
import Tasks from "app/pages/tasks/Tasks";
import Navbar from "app/layout/Navbar";
import Invite from "app/pages/Invite";
import Welcome from "app/pages/welcome/";
import Register from "app/pages/auth/register.component";
import Login from "app/pages/auth/login.component";
import Error from "app/pages/Error";
import { Settings } from "app/pages/Settings";

export default function App() {
  const user = useAppSelector(selectUser);
  const loadingUser = useAppSelector(selectLoadingUser);
  const loadingProjects = useAppSelector(selectLoadingProjects);
  const dispatch = useAppDispatch();
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
            <Route path="/settings" element={<Settings />} />
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
