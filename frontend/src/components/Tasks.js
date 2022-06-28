import React, { useEffect, useId } from "react";
import Task from "./Task";
import { useProjects } from "../ProjectsContext";

export default function Tasks(props) {
  const { projectTasks, handleTasks, projectSelected } = useProjects();

  useEffect(() => console.log(projectTasks), [projectTasks]);

  const addTaskFormId = useId();

  if (!projectSelected) {
    return <div style={{ padding: "0.5rem" }}>Select a project</div>;
  }

  return (
    <div style={{ padding: "0.5rem" }}>
      <form>
        <input
          id={addTaskFormId}
          type={"text"}
          placeholder={"New task"}
        ></input>
        <button
          onClick={(event) => {
            event.preventDefault();
            handleTasks.create(
              projectSelected,
              document.getElementById(addTaskFormId).value
            );
          }}
        >
          + Add task
        </button>
      </form>
      <ul>
        {projectTasks[projectSelected].map((item) => (
          <Task
            key={"task-" + item.id}
            projectId={projectSelected}
            task={item}
            handleTasks={handleTasks}
          />
        ))}
      </ul>
    </div>
  );
}
