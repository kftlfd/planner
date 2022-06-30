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

  const [showDoneTasks, setShowDoneTasks] = useState(true);
  const handleShowDoneChange = () => setShowDoneTasks(!showDoneTasks);

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

  const showDoneToggle = (
    <div>
      <input
        id={"show-done-toggle"}
        type={"checkbox"}
        checked={showDoneTasks}
        onChange={handleShowDoneChange}
      />
      <label for={"show-done-toggle"}>Show done</label>
    </div>
  );

  const tasksList = projects[projectId].tasks
    ? Object.keys(projects[projectId].tasks).map((id) => {
        if (projects[projectId].tasks?.[id]) {
          return (
            <Task
              key={`pj-${projectId}-task-${id}`}
              projectId={projectId}
              task={projects[projectId].tasks[id]}
              showDoneTasks={showDoneTasks}
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {taskAddForm}
        {showDoneToggle}
      </div>
      {tasksList}
    </div>
  );
}
