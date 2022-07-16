import API from "./config";

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
    const q = queryConstructor(API.userProjects(userId));
    return q();
  },

  async create(projectName) {
    const q = queryConstructor(API.projectCreate, {
      method: "POST",
      headers: {
        "X-CSRFToken": API.csrftoken(),
        "content-type": "application/json",
      },
      body: JSON.stringify({ name: projectName }),
    });
    return q();
  },

  async update(projectId, projectUpdate) {
    const q = queryConstructor(API.projectDetail(projectId), {
      method: "PATCH",
      headers: {
        "X-CSRFToken": API.csrftoken(),
        "content-type": "application/json",
      },
      body: JSON.stringify(projectUpdate),
    });
    return q();
  },

  async delete(projectId) {
    let response = await fetch(API.projectDetail(projectId), {
      method: "DELETE",
      headers: { "X-CSRFToken": API.csrftoken() },
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
    const q = queryConstructor(API.projectTasks(projectId));
    return q();
  },

  async create(projectId, taskTitle) {
    const q = queryConstructor(API.taskCreate, {
      method: "POST",
      headers: {
        "X-CSRFToken": API.csrftoken(),
        "content-type": "application/json",
      },
      body: JSON.stringify({ project: projectId, title: taskTitle }),
    });
    return q();
  },

  async update(projectId, taskId, taskUpdate) {
    const q = queryConstructor(API.taskDetail(taskId), {
      method: "PATCH",
      headers: {
        "X-CSRFToken": API.csrftoken(),
        "content-type": "application/json",
      },
      body: JSON.stringify(taskUpdate),
    });
    return q();
  },

  async delete(projectId, taskId) {
    let response = await fetch(API.taskDetail(taskId), {
      method: "DELETE",
      headers: { "X-CSRFToken": API.csrftoken() },
    });
    if (response.ok) {
      return;
    } else {
      throw new Error(await response.text());
    }
  },
};