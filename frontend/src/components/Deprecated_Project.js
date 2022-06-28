import React, { useState } from "react";

export default function Project(props) {
  const [renameValue, setRenameValue] = useState(props.item.name);
  const renameValueChange = (e) => setRenameValue(e.target.value);

  return (
    <div style={{ padding: "0.5rem" }}>
      <div
        onClick={() => props.onProjectSelect(props.item.id)}
        style={props.selected ? { fontWeight: "bold" } : {}}
      >
        {props.item.name}
      </div>
      <form>
        <input
          id={"rename-" + props.item.id}
          type={"text"}
          placeholder={"Rename"}
          value={renameValue}
          onChange={renameValueChange}
        ></input>
        <button
          onClick={(event) => {
            event.preventDefault();
            let name = document.getElementById("rename-" + props.item.id).value;
            props.handleProjects.update(props.item.id, { name: name });
          }}
          disabled={!renameValue}
        >
          Rename
        </button>
      </form>
      <form>
        <button
          onClick={(event) => {
            event.preventDefault();
            props.handleProjects.delete(props.item.id);
          }}
        >
          Delete
        </button>
      </form>
    </div>
  );
}
