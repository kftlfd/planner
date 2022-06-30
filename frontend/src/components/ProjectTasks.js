import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProjects } from "../ProjectsContext";
import Task from "./Task";

export default function ProjectTasks(props) {
  const params = useParams();
  const [projectId, setProjectId] = useState(Number(params.projectId));
  const { projects, checkProjectTasks, handleTasks } = useProjects();

  const [taskAddTitle, setTaskAddTitle] = useState("");
  const handleTaskAddTitleChange = (e) => setTaskAddTitle(e.target.value);

  useEffect(() => {
    checkProjectTasks(projectId);
  }, [[], projectId]);

  useEffect(() => {
    setProjectId(Number(params.projectId));
  }, [params.projectId]);

  if (!projects[projectId]) {
    return <></>;
  }

  const taskAddForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleTasks.create(projectId, taskAddTitle);
      }}
    >
      <input
        type={"text"}
        placeholder={"New task"}
        value={taskAddTitle}
        onChange={handleTaskAddTitleChange}
      />
      <button type={"submit"} disabled={!taskAddTitle}>
        + Add task
      </button>
    </form>
  );

  const tasksList = projects[projectId].tasks
    ? Object.keys(projects[projectId].tasks).map((id) => {
        if (projects[projectId].tasks?.[id]) {
          return (
            <Task
              key={`pj-${projectId}-task-${id}`}
              task={projects[projectId].tasks[id]}
            />
          );
        }
      })
    : null;

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "lightblue",
        wordWrap: "anywhere",
      }}
    >
      {taskAddForm}
      {tasksList}
    </div>
  );
}
