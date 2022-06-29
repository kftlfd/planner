import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProjects } from "../ProjectsContext";

export default function ProjectTasks(props) {
  const { projectId } = useParams();
  const { getProjectTasks } = useProjects();
  const [tasks, setTasks] = useState([]);

  async function loadTasks(projectId) {
    setTasks([]);
    setTasks(await getProjectTasks(Number(projectId)));
  }

  useEffect(() => {
    loadTasks(projectId);
  }, []);

  useEffect(() => {
    loadTasks(projectId);
  }, [projectId]);

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
      <div>
        {tasks.map((item, index) => {
          if (item.id) {
            return (
              <div key={`pj-${projectId}-task-${item.id}`}>{item.title}</div>
            );
          }
          if (item.error) {
            return <div key={`pj-${projectId}-err-${index}`}>{item.error}</div>;
          }
        })}
      </div>
    </div>
  );
}
