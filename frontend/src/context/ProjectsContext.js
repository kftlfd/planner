import React, { useState, useEffect, useContext, createContext } from "react";

import API from "../api/config";
import { useAuth } from "./AuthContext";

const ProjectsContext = createContext();

export default function ProvideProjects({ children }) {
  const projects = useProvideProjects();
  return (
    <ProjectsContext.Provider value={projects}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectsContext);
}

function useProvideProjects() {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState({});

  useEffect(() => {
    async function loadProjects() {
      if (auth.user) {
        let response = await fetch(API.userProjects(auth.user.id));
        let res = await response.json();
        setProjects(res);
      }
      setLoading(false);
    }
    loadProjects();
  }, []);

  const checkProjectTasks = (projectId) => {
    if (!projects[projectId]) {
      console.error(`Project with id ${projectId} not found.`);
      return;
    }

    if (!projects[projectId].tasks) {
      fetch(API.projectTasks(projectId))
        .then((response) => (response.ok ? response.json() : response.text()))
        .then((res) => {
          if (typeof res === "object") {
            setProjects((projects) => ({
              ...projects,
              [projectId]: { ...projects[projectId], tasks: res },
            }));
          } else {
            console.error("Error while loading project tasks:", res);
          }
        });
    }
  };

  const handleProjects = {
    create: (name) => {
      return fetch(API.projectCreate, {
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
            setProjects((projects) => ({
              ...projects,
              [res.id]: res,
            }));
            return res;
          },
          (err) => {
            console.log(err);
          }
        );
    },

    update: (projectId, projectUpdate) => {
      fetch(API.projectDetail(projectId), {
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
            setProjects((projects) => ({
              ...projects,
              [projectId]: res,
            }));
          },
          (err) => {
            console.log(err);
          }
        );
    },

    delete: (projectId) => {
      fetch(API.projectDetail(projectId), {
        method: "DELETE",
        headers: { "X-CSRFToken": API.csrftoken() },
      })
        .then((response) => response.text())
        .then(
          () => {
            setProjects((projects) => {
              const copy = { ...projects };
              delete copy[projectId];
              return copy;
            });
          },
          (err) => {
            console.log(err);
          }
        );
    },
  };

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
            setProjects((prev) => ({
              ...prev,
              [projectId]: {
                ...prev[projectId],
                tasks: { ...prev[projectId].tasks, [res.id]: res },
              },
            }));
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
            setProjects((projects) => ({
              ...projects,
              [projectId]: {
                ...projects[projectId],
                tasks: {
                  ...projects[projectId].tasks,
                  [taskId]: res,
                },
              },
            }));
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
          (res) => {
            setProjects((projects) => {
              let copy = { ...projects };
              delete copy[projectId].tasks[taskId];
              return copy;
            });
          },
          (err) => {
            console.log(err);
          }
        );
    },
  };

  return {
    loading,
    projects,
    checkProjectTasks,
    handleProjects,
    handleTasks,
  };
}
