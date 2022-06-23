import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../auth";
import Tasklists from "./Tasklists";

export default function Home(props) {
  const auth = useAuth();
  const [userTasklists, setUserTasklists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(loadTasklists, []);

  function loadTasklists() {
    fetch(API.userTasklists(auth.user.id))
      .then((response) => response.json())
      .then(
        (res) => {
          setUserTasklists(res.tasklists);
        },
        (err) => {
          console.log(err);
        }
      )
      .finally(setLoading(false));
  }

  function onCreate(name) {
    fetch(API.tasklistCreate, {
      method: "POST",
      headers: {
        "X-CSRFToken": API.csrftoken(),
        "content-type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    })
      .then((response) => response.json())
      .then(
        (res) => {
          setUserTasklists([...userTasklists, res]);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  function onRename(id, name) {
    fetch(API.tasklistDetail(id), {
      method: "PATCH",
      headers: {
        "X-CSRFToken": API.csrftoken(),
        "content-type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    })
      .then((response) => response.json())
      .then(
        (res) => {
          setUserTasklists(
            userTasklists.map((item) => {
              if (item.id === res.id) {
                return res;
              } else {
                return item;
              }
            })
          );
        },
        (err) => {
          console.log(err);
        }
      );
  }

  function onDelete(id) {
    fetch(API.tasklistDetail(id), {
      method: "DELETE",
      headers: { "X-CSRFToken": API.csrftoken() },
    })
      .then((response) => response.text())
      .then(
        () => {
          setUserTasklists(userTasklists.filter((item) => item.id !== id));
        },
        (err) => {
          console.log(err);
        }
      );
  }

  if (!auth.user) {
    return <Navigate to="/welcome" />;
  }

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <h1>Home</h1>
      <Tasklists
        tasklists={userTasklists}
        onCreate={onCreate}
        onRename={onRename}
        onDelete={onDelete}
      />
    </>
  );
}
