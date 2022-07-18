import { urls, csrftoken } from "./config";

function queryConstructor(url = "", options = {}) {
  return async () => {
    let response = await fetch(url, options);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(await response.text());
    }
  };
}

export const projects = {
  async load(userId) {
    const q = queryConstructor(urls.userProjects(userId));
    return q();
  },

  async create(projectName) {
    const q = queryConstructor(urls.projectCreate, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrftoken(),
        "content-type": "application/json",
      },
      body: JSON.stringify({ name: projectName }),
    });
    return q();
  },

  async update(projectId, projectUpdate) {
    const q = queryConstructor(urls.projectDetails(projectId), {
      method: "PATCH",
      headers: {
        "X-CSRFToken": csrftoken(),
        "content-type": "application/json",
      },
      body: JSON.stringify(projectUpdate),
    });
    return q();
  },

  async delete(projectId) {
    let response = await fetch(urls.projectDetails(projectId), {
      method: "DELETE",
      headers: { "X-CSRFToken": csrftoken() },
    });
    if (response.ok) {
      return;
    } else {
      throw new Error(await response.text());
    }
  },
};

export const tasks = {
  async load(projectId) {
    const q = queryConstructor(urls.projectTasks(projectId));
    return q();
  },

  async create(projectId, taskTitle) {
    const q = queryConstructor(urls.taskCreate, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrftoken(),
        "content-type": "application/json",
      },
      body: JSON.stringify({ project: projectId, title: taskTitle }),
    });
    return q();
  },

  async update(projectId, taskId, taskUpdate) {
    const q = queryConstructor(urls.taskDetails(taskId), {
      method: "PATCH",
      headers: {
        "X-CSRFToken": csrftoken(),
        "content-type": "application/json",
      },
      body: JSON.stringify(taskUpdate),
    });
    return q();
  },

  async delete(projectId, taskId) {
    let response = await fetch(urls.taskDetails(taskId), {
      method: "DELETE",
      headers: { "X-CSRFToken": csrftoken() },
    });
    if (response.ok) {
      return;
    } else {
      throw new Error(await response.text());
    }
  },
};
