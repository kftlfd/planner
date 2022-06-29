import React from "react";
import { Outlet } from "react-router-dom";

export default function Project(props) {
  return (
    <div
      style={{
        flexGrow: "1",
        margin: "1rem",
        padding: "1rem",
        backgroundColor: "lemonchiffon",
      }}
    >
      <h4>{"<Project.js>"}</h4>
      <Outlet />
    </div>
  );
}
