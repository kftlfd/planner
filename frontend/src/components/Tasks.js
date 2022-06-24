import React, { useId } from "react";
import Task from "./Task";

export default function Tasks(props) {
  const addTaskFormId = useId();

  if (!props.projectId) {
    return <div>Select a project</div>;
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
            props.onTaskCreate(
              props.projectId,
              document.getElementById(addTaskFormId).value
            );
          }}
        >
          + Add task
        </button>
      </form>
      <ul>
        {props.projectTasks?.map((item) => {
          return (
            <Task
              key={"task-" + item.id}
              projectId={props.projectId}
              task={item}
              onTaskUpdate={props.onTaskUpdate}
              onTaskDelete={props.onTaskDelete}
            />
          );
        })}
      </ul>
    </div>
  );
}
