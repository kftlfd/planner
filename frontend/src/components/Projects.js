import React, { useId, useState } from "react";
import Project from "./Project";

export default function Projects(props) {
  const newListInput = useId();
  const [newTasklistName, setNewTasklistName] = useState("");
  const newTasklistNameChange = (e) => setNewTasklistName(e.target.value);

  return (
    <div>
      <form>
        <input
          id={newListInput}
          type={"text"}
          value={newTasklistName}
          onChange={newTasklistNameChange}
          placeholder={"New list"}
        ></input>
        <button
          onClick={(event) => {
            event.preventDefault();
            let name = document.getElementById(newListInput).value;
            props.onProjectCreate(name);
          }}
          disabled={!newTasklistName}
        >
          + Add new
        </button>
      </form>
      {props.projects?.map((item) => {
        return (
          <Project
            key={"project-" + item.id}
            item={item}
            selected={props.projectSelected === item.id}
            onProjectRename={props.onProjectRename}
            onProjectDelete={props.onProjectDelete}
            onProjectSelect={props.onProjectSelect}
          />
        );
      })}
    </div>
  );
}
