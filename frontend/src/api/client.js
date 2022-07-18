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
    return await q();
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
    return await q();
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
    return await q();
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

  sharing: {
    async enable(projectId) {
      const q = queryConstructor(urls.projectSharing(projectId), {
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken(),
          "content-type": "application/json",
        },
        body: JSON.stringify({ action: "sharing-update", sharing: true }),
      });
      return await q();
    },

    async disable(projectId) {
      const q = queryConstructor(urls.projectSharing(projectId), {
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken(),
          "content-type": "application/json",
        },
        body: JSON.stringify({ action: "sharing-update", sharing: false }),
      });
      return await q();
    },
  },

  invite: {
    async recreate(projectId) {
      const q = queryConstructor(urls.projectSharing(projectId), {
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken(),
          "content-type": "application/json",
        },
        body: JSON.stringify({ action: "invite-update", type: "recreate" }),
      });
      return await q();
    },

    async delete(projectId) {
      const q = queryConstructor(urls.projectSharing(projectId), {
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken(),
          "content-type": "application/json",
        },
        body: JSON.stringify({ action: "invite-update", type: "delete" }),
      });
      return await q();
    },
  },
};

export const tasks = {
  async load(projectId) {
    const q = queryConstructor(urls.projectTasks(projectId));
    return await q();
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
    return await q();
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
    return await q();
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

export const invite = {
  async get(inviteCode) {
    const q = queryConstructor(urls.invite(inviteCode));
    return await q();
  },

  async post(inviteCode) {
    let response = await fetch(urls.invite(inviteCode), {
      method: "POST",
      headers: { "X-CSRFToken": csrftoken() },
    });
    if (response.ok) {
      return;
    } else {
      throw new Error(await response.text());
    }
  },
};
