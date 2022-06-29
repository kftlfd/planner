import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Navbar from "./Navbar";
import Drawer from "./Drawer";
import ProjectsList from "./ProjectsList";

export default function Main(props) {
  const auth = useAuth();

  if (!auth.user) {
    return <Navigate to="/welcome" />;
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
