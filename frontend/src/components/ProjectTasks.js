import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProjects } from "../ProjectsContext";

export default function ProjectTasks(props) {
  const { projectId } = useParams();
  const { projectTasks } = useProjects();

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "lightblue",
        wordWrap: "anywhere",
      }}
    >
      <h4>{"<ProjectTasks.js>"}</h4>
      <div>Project {projectId}</div>
      <ul>
        {projectTasks[projectId]?.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
