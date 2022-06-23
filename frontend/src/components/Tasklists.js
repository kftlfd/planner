import React, { useId } from "react";

export default function Tasklists(props) {
  const newListInput = useId();

  return(
    <>
      <ul>
        {
          props.tasklists.map(item => {
            return(
              <li key={'tasklist-' + item.id}>
                <span>{item.name}</span>
                <div>

                  <form>
                    <input id={'rename-' + item.id} type={"text"} placeholder={"Rename"}></input>
                    <button onClick={(event) => {
                        event.preventDefault();
                        let name = document.getElementById('rename-' + item.id).value;
                        props.onRename(item.id, name);
                        }
                      }
                    >Rename</button>
                  </form>

                  <form>
                    <button onClick={(event) => {
                      event.preventDefault();
                      props.onDelete(item.id);
                    }}>Delete</button>
                  </form>

                </div>
              </li>
            )
          })
        }
      </ul>
      <form>
        <input id={newListInput} type={"text"} placeholder={"New list"}></input>
        <button onClick={(event) => {
          event.preventDefault();
          let name = document.getElementById(newListInput).value;
          props.onCreate(name);
        }}>+ Add new</button>
      </form>
    </>
  )
}
