import React, { useState } from "react";
import { useProjects } from "../ProjectsContext";

export default function Task(props) {
  const { projectId, task, showDoneTasks } = props;
  const { handleTasks } = useProjects();

  const [taskRenameValue, setTaskRenameValue] = useState(task.title);
  const onTaskRenameValueChange = (e) => setTaskRenameValue(e.target.value);

  const [taskDone, setTaskDone] = useState(task.done);
  const onTaskDoneChange = () => {
    let newValue = !taskDone;
    setTaskDone(newValue);
    handleTasks.update(projectId, task.id, {
      done: newValue,
    });
  };

  const handleTaskRename = (event) => {
    event.preventDefault();
    handleTasks.update(projectId, task.id, {
      title: event.target.rename.value,
    });
  };

  const handleTaskDelete = (event) => {
    event.preventDefault();
    handleTasks.delete(projectId, task.id);
  };

  return (
    <div
      style={{
        marginTop: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem",
        display: task.done ? (showDoneTasks ? "block" : "none") : "block",
      }}
    >
      <div style={{ display: "flex", gap: "1rem" }}>
        <div>
          <input
            type={"checkbox"}
            checked={taskDone}
            onChange={onTaskDoneChange}
          />
        </div>
        <div>{task.title}</div>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <form onSubmit={handleTaskRename}>
          <input
            type={"text"}
            name={"rename"}
            placeholder={"Task title"}
            value={taskRenameValue}
            onChange={onTaskRenameValueChange}
          ></input>
          <button type={"submit"} disabled={!taskRenameValue}>
            Rename
          </button>
        </form>
        <form onSubmit={handleTaskDelete}>
          <button type={"submit"}>Delete</button>
        </form>
      </div>
    </div>
  );
}
