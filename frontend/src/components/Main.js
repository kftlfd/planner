import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";
import Navbar from "./Navbar";
import Drawer from "./Drawer";
import ProjectsList from "./ProjectsList";
import Tasks from "./Tasks";

export default function Main(props) {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [projectSelected, setProjectSelected] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);

  useEffect(loadProjects, []);

  function loadProjects() {
    if (auth.user) {
      fetch(API.userProjects(auth.user.id))
        .then((response) => response.json())
        .then(
          async (res) => {
            setProjects(res.projects);
            setProjectTasks(loadTasks(res.projects));
          },
          (err) => {
            console.log(err);
          }
        )
        .finally(setLoading(false));
    }
  }

  const handleProjects = {
    create: (name) => {
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
    },

    update: (id, projectUpdate) => {
      fetch(API.projectDetail(id), {
        method: "PATCH",
        headers: {
          "X-CSRFToken": API.csrftoken(),
          "content-type": "application/json",
        },
        body: JSON.stringify(projectUpdate),
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
    },

    delete: (id) => {
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
    },
  };

  function loadTasks(projects) {
    let tasks = {};
    projects.forEach(async (project) => {
      let response = await fetch(API.projectDetail(project.id));
      let res = await response.json();
      tasks[project.id] = res.tasks;
    });
    return tasks;
  }

  const handleTasks = {
    create: (projectId, taskTitle) => {
      fetch(API.taskCreate, {
        method: "POST",
        headers: {
          "X-CSRFToken": API.csrftoken(),
          "content-type": "application/json",
        },
        body: JSON.stringify({ project: projectId, title: taskTitle }),
      })
        .then((response) => response.json())
        .then(
          (res) => {
            let modifiedProjects = { ...projectTasks };
            if (!modifiedProjects[projectId]) {
              modifiedProjects[projectId] = [];
            }
            modifiedProjects[projectId].push(res);
            setProjectTasks(modifiedProjects);
          },
          (err) => {
            console.log(err);
          }
        );
    },

    update: (projectId, taskId, taskUpdate) => {
      fetch(API.taskDetail(taskId), {
        method: "PATCH",
        headers: {
          "X-CSRFToken": API.csrftoken(),
          "content-type": "application/json",
        },
        body: JSON.stringify(taskUpdate),
      })
        .then((response) => response.json())
        .then(
          (res) => {
            let modifiedProjects = { ...projectTasks };
            modifiedProjects[projectId] = modifiedProjects[projectId].map(
              (task) => {
                if (task.id === taskId) {
                  return res;
                } else {
                  return task;
                }
              }
            );
            setProjectTasks(modifiedProjects);
          },
          (err) => {
            console.log(err);
          }
        );
    },

    delete: (projectId, taskId) => {
      fetch(API.taskDetail(taskId), {
        method: "DELETE",
        headers: { "X-CSRFToken": API.csrftoken() },
      })
        .then((response) => response.text())
        .then(
          () => {
            let modifiedProjects = { ...projectTasks };
            modifiedProjects[projectId] = modifiedProjects[projectId].filter(
              (item) => item.id !== taskId
            );
            setProjectTasks(modifiedProjects);
          },
          (err) => {
            console.log(err);
          }
        );
    },
  };

  if (!auth.user) {
    return <Navigate to="/welcome" />;
  }

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <Navbar />

      <Drawer>
        <ProjectsList
          projects={projects}
          projectSelected={projectSelected}
          onProjectSelect={setProjectSelected}
          handleProjects={handleProjects}
        />
      </Drawer>

      <Tasks
        projectId={projectSelected}
        projectTasks={projectTasks[projectSelected]}
        handleTasks={handleTasks}
      />
    </>
  );
}
