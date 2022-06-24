import React, { useState } from "react";

export default function Project(props) {
  const [renameValue, setRenameValue] = useState(props.item.name);
  const renameValueChange = (e) => setRenameValue(e.target.value);

  return (
    <div>
      <div>{props.item.name}</div>
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
            props.onProjectRename(props.item.id, name);
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
            props.onProjectDelete(props.item.id);
          }}
        >
          Delete
        </button>
      </form>
    </div>
  );
}
