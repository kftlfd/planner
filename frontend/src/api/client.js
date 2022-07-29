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

function authQuery(url, formData) {
  return async () => {
    let response = await fetch(url, {
      method: "POST",
      headers: { "X-CSRFToken": csrftoken() },
      body: formData,
    });
    if (response.ok) {
      return {
        ok: true,
        user: await response.json(),
      };
    } else if (response.status === 406) {
      return {
        ok: false,
        status: response.status,
        formErrors: await response.json(),
      };
    } else {
      return {
        ok: false,
        status: response.status,
        error: await response.text(),
      };
    }
  };
}

export const auth = {
  async fetchUser() {
    const response = await fetch(urls.login, {
      method: "POST",
      headers: { "X-CSRFToken": csrftoken() },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(await response.text());
    }
  },

  async register(formData) {
    const q = authQuery(urls.register, formData);
    return await q();
  },

  async login(formData) {
    const q = authQuery(urls.login, formData);
    return await q();
  },

  async logout() {
    const response = await fetch(urls.logout);
    if (!response.ok) {
      throw new Error(await response.text());
    }
  },
};

export const user = {
  async update(userId, update) {
    const q = queryConstructor(urls.userUpdate(userId), {
      method: "POST",
      headers: {
        "X-CSRFToken": csrftoken(),
        "content-type": "application/json",
      },
      body: JSON.stringify(update),
    });
    return q();
  },
};

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
    let response = await fetch(urls.projectDelete(projectId), {
      method: "DELETE",
      headers: { "X-CSRFToken": csrftoken() },
    });
    if (response.ok) {
      return;
    } else {
      throw new Error(await response.text());
    }
  },

  async leave(projectId) {
    const q = queryConstructor(urls.projectLeave(projectId), {
      method: "POST",
      headers: { "X-CSRFToken": csrftoken() },
    });
    return await q();
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

  async create(projectId, taskTitle, userId) {
    const q = queryConstructor(urls.taskCreate, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrftoken(),
        "content-type": "application/json",
      },
      body: JSON.stringify({
        project: projectId,
        title: taskTitle,
        user: userId,
      }),
    });
    return await q();
  },

  async update(taskId, taskUpdate) {
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

  async delete(taskId) {
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

  async post(inviteCode, action) {
    let response = await fetch(urls.invite(inviteCode), {
      method: "POST",
      headers: {
        "X-CSRFToken": csrftoken(),
        "content-type": "application/json",
      },
      body: JSON.stringify({ action: action }),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(await response.text());
    }
  },
};
