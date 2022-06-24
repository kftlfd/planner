import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../auth";
import Projects from "./Projects";

export default function Home(props) {
  const auth = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(loadProjects, []);

  function loadProjects() {
    if (auth.user) {
      fetch(API.userProjects(auth.user.id))
        .then((response) => response.json())
        .then(
          (res) => {
            setProjects(res.projects);
          },
          (err) => {
            console.log(err);
          }
        )
        .finally(setLoading(false));
    }
  }

  function onProjectCreate(name) {
    fetch(API.projectCreate, {
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
          setProjects([...projects, res]);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  function onProjectRename(id, name) {
    fetch(API.projectDetail(id), {
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
          setProjects(
            projects.map((item) => {
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

  function onProjectDelete(id) {
    fetch(API.projectDetail(id), {
      method: "DELETE",
      headers: { "X-CSRFToken": API.csrftoken() },
    })
      .then((response) => response.text())
      .then(
        () => {
          setProjects(projects.filter((item) => item.id !== id));
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
      <Projects
        projects={projects}
        onProjectCreate={onProjectCreate}
        onProjectRename={onProjectRename}
        onProjectDelete={onProjectDelete}
      />
    </>
  );
}
