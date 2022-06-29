import React, { useState, useEffect, useContext, createContext } from "react";
import API from "./api";
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
  const [projects, setProjects] = useState([]);
  const [projectTasks, setProjectTasks] = useState({});
  const [projectSelected, setProjectSelected] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    if (auth.user) {
      setProjects(await loadProjects(auth.user.id));
    }
    setLoading(false);
  }

  async function loadProjects(userId) {
    let response = await fetch(API.userProjects(userId));
    let res = await response.json();
    return res.projects;
    // .then((response) => response.json())
    // .then(
    //   (res) => {
    //     setProjects(res.projects);
    //     setProjectTasks(loadTasks(res.projects));
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // )
    // .then(() => null);
  }

  function loadTasks(projects) {
    let tasks = {};
    projects.forEach(async (project) => {
      let response = await fetch(API.projectDetail(project.id));
      let res = await response.json();
      tasks[project.id] = res.tasks;
    });
    return tasks;
  }

  async function getProjectTasks(projectId) {
    let project = projects.find((item) => item.id === projectId);
    if (!project) {
      return [{ error: `Project with projectId ${projectId} not found.` }];
    }

    if (!project.tasks) {
      let response = await fetch(API.projectDetail(projectId));
      let res = await response.json();
      project.tasks = res.tasks;
    }

    return project.tasks;
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
            let modified = projectTasks;
            projectTasks[res.id] = [];
            setProjectTasks(modified);
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
            setProjectSelected(null);
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

  return {
    loading,
    handleProjects,
    handleTasks,
    projects,
    projectTasks,
    projectSelected,
    setProjectSelected,
    getProjectTasks,
  };
}
