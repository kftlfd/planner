import { FC, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { useActions } from "~/context/ActionsContext";
import { SplashScreen } from "~/layout/Loading";
import Navbar from "~/layout/Navbar";
import Login from "~/pages/auth/login.component";
import Register from "~/pages/auth/register.component";
import Error from "~/pages/Error";
import Home from "~/pages/home/Home";
import Invite from "~/pages/Invite";
import Project from "~/pages/project/Project";
import { Settings } from "~/pages/Settings";
import Tasks from "~/pages/tasks/Tasks";
import Welcome from "~/pages/welcome/";
import { useAppDispatch, useAppSelector } from "~/store";
import { selectLoadingProjects } from "~/store/projectsSlice";
import { fetchUser, selectLoadingUser, selectUser } from "~/store/usersSlice";

const App: FC = () => {
  const user = useAppSelector(selectUser);
  const loadingUser = useAppSelector(selectLoadingUser);
  const loadingProjects = useAppSelector(selectLoadingProjects);
  const dispatch = useAppDispatch();
  const actions = useActions();

  useEffect(() => {
    dispatch(fetchUser()).catch((err: unknown) => {
      console.error(err);
    });
  }, [dispatch]);

  useEffect(() => {
    if (user && loadingProjects) {
      actions.project.loadProjects().catch((err: unknown) => {
        console.error(err);
      });
    }
  }, [user, loadingProjects, actions.project]);

  if (loadingUser) {
    return <SplashScreen />;
  }

  if (user && loadingProjects) {
    return <SplashScreen message={"Loading projects"} />;
  }

  return (
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
  );
};

export default App;
