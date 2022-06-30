import React from "react";
import { useParams, Outlet } from "react-router-dom";
import { useProjects } from "../ProjectsContext";

export default function Project(props) {
  const { projectId } = useParams();
  const { projects } = useProjects();

  return (
    <div
      style={{
        flexGrow: "1",
        padding: "1rem",
      }}
    >
      {projectId ? (
        projects[Number(projectId)] ? (
          <h4>{projects[Number(projectId)].name}</h4>
        ) : (
          <h4>Project {projectId} not found</h4>
        )
      ) : (
        <h4>Select a project</h4>
      )}
      <Outlet />
    </div>
  );
}
