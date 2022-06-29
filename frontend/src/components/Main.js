import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useProjects } from "../ProjectsContext";
import Navbar from "./Navbar";
import Drawer from "./Drawer";
import ProjectsList from "./ProjectsList";

export default function Main(props) {
  const auth = useAuth();
  const { loading } = useProjects();

  if (!auth.user) {
    return <Navigate to="/welcome" />;
  }

  if (loading) {
    return <div>Loading projects</div>;
  }

  return (
    <>
      <Navbar />

      <Drawer>
        <ProjectsList />
      </Drawer>

      <Outlet />
    </>
  );
}
