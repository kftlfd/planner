import { urls, methods, query, authQuery } from "./config";

//
// Auth
//

export const auth = {
  async register(formData) {
    return await authQuery(urls.auth.register, formData);
  },

  async login(formData) {
    return await authQuery(urls.auth.login, formData);
  },

  async logout() {
    return await authQuery(urls.auth.logout);
  },
};

//
// User
//

export const user = {
  async load() {
    return await query(urls.auth.login, methods.post);
  },

  async update(userUpdate) {
    return await query(urls.user.details, methods.patch, userUpdate);
  },

  async projects() {
    return await query(urls.user.projects, methods.get);
  },
};

//
// Project
//

export const project = {
  async create(projectName) {
    return await query(urls.project.create, methods.post, {
      name: projectName,
    });
  },

  async update(projectId, projectUpdate) {
    return await query(
      urls.project.details(projectId),
      methods.patch,
      projectUpdate
    );
  },

  async delete(projectId) {
    return await query(urls.project.details(projectId), methods.delete);
  },

  async tasks(projectId) {
    return await query(urls.project.tasks(projectId), methods.get);
  },

  sharing: {
    async enable(projectId) {
      return await query(urls.project.sharing(projectId), methods.post, {
        sharing: true,
      });
    },

    async disable(projectId) {
      return await query(urls.project.sharing(projectId), methods.post, {
        sharing: false,
      });
    },
  },

  invite: {
    async recreate(projectId) {
      return await query(urls.project.sharing(projectId), methods.post, {
        invite: "recreate",
      });
    },

    async delete(projectId) {
      return await query(urls.project.sharing(projectId), methods.post, {
        invite: "delete",
      });
    },
  },

  async leave(projectId) {
    return await query(urls.project.leave(projectId), methods.post);
  },
};

//
// Invite
//

export const invite = {
  async get(inviteCode) {
    return await query(urls.invite(inviteCode), methods.get);
  },

  async join(inviteCode) {
    return await query(urls.invite(inviteCode), methods.post);
  },
};

//
// Task
//

export const task = {
  async create(projectId, taskTitle) {
    return await query(urls.task.create, methods.post, {
      project: projectId,
      title: taskTitle,
    });
  },

  async update(taskId, taskUpdate) {
    return await query(urls.task.details(taskId), methods.patch, taskUpdate);
  },

  async delete(taskId) {
    return await query(urls.task.details(taskId), methods.delete);
  },
};
