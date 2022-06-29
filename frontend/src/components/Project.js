import React from "react";
import { Outlet } from "react-router-dom";

export default function Project(props) {
  return (
    <div style={{ margin: "1rem", backgroundColor: "lemonchiffon" }}>
      <div>{"<Project.js>"}</div>
      <Outlet />
    </div>
  );
}
