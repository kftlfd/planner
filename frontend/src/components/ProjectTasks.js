import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProjects } from "../ProjectsContext";

export default function ProjectTasks(props) {
  const { projectId } = useParams();
  const { projectTasks } = useProjects();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(projectTasks[projectId]);
  }, [projectTasks]);

  return (
    <div style={{ margin: "1rem", backgroundColor: "lightblue" }}>
      <div>{"<ProjectTasks.js>"}</div>
      <div>{JSON.stringify(projectId)}</div>
      <div>{JSON.stringify(tasks)}</div>
    </div>
  );
}
