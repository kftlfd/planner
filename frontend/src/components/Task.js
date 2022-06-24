import React, { useState } from "react";

export default function Task(props) {
  const [taskTitle, setTaskTitle] = useState(props.task.title);
  const onTaskTitleChange = (e) => {
    setTaskTitle(e.target.value);
  };

  const [taskDone, setTaskDone] = useState(props.task.done);
  const onTaskDoneChange = () => {
    let newValue = !taskDone;
    setTaskDone(newValue);
    props.onTaskUpdate(props.projectId, props.task.id, { done: newValue });
  };

  return (
    <li>
      <div>{props.task.title}</div>
      <div>
        <input
          type={"checkbox"}
          checked={taskDone}
          onChange={onTaskDoneChange}
        />
      </div>
      <div>
        <input
          id={"task-" + props.task.id}
          type={"text"}
          placeholder={"Task title"}
          value={taskTitle}
          onChange={onTaskTitleChange}
        ></input>
        <button
          disabled={!taskTitle}
          onClick={(event) => {
            event.preventDefault();
            props.onTaskUpdate(props.projectId, props.task.id, {
              title: document.getElementById("task-" + props.task.id).value,
            });
          }}
        >
          Rename
        </button>
      </div>
      <div>
        <button
          onClick={(event) => {
            event.preventDefault();
            props.onTaskDelete(props.projectId, props.task.id);
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
