import { FC, lazy, ReactElement, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { useActions } from "~/context/ActionsContext";
import { LoadingSpinner, SplashScreen } from "~/layout/Loading";
import Navbar from "~/layout/Navbar";
import Error from "~/pages/Error";
import Home from "~/pages/home/Home";
import { useAppDispatch, useAppSelector } from "~/store";
import { selectLoadingProjects } from "~/store/projectsSlice";
import { fetchUser, selectLoadingUser, selectUser } from "~/store/usersSlice";

const withSuspense = (
  Component: FC,
  fallback: ReactElement = <LoadingSpinner />,
) => {
  const Cmp: FC = () => (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
  Cmp.displayName = `Suspended${Component.displayName}`;
  return Cmp;
};

const Login = withSuspense(lazy(() => import("~/pages/auth/login.component")));
const Register = withSuspense(
  lazy(() => import("~/pages/auth/register.component")),
);
const Invite = withSuspense(lazy(() => import("~/pages/Invite")));
const Project = withSuspense(lazy(() => import("~/pages/project/Project")));
const Settings = withSuspense(lazy(() => import("~/pages/Settings")));
const Tasks = withSuspense(lazy(() => import("~/pages/tasks/Tasks")));
const Welcome = withSuspense(lazy(() => import("~/pages/welcome/")));

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
