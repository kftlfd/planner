import { urls, methods, query, authQuery, queryNoResponse } from "./config";

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

  async password(passwords) {
    return await query(urls.user.password, methods.post, passwords);
  },

  async projects() {
    return await query(urls.user.projects, methods.get);
  },

  async deleteAccount() {
    return await queryNoResponse(urls.user.details, methods.delete);
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
    return await queryNoResponse(
      urls.project.details(projectId),
      methods.delete
    );
  },

  async tasks(projectId) {
    return await query(urls.project.tasks(projectId), methods.get);
  },

  async chat(projectId) {
    return await query(urls.project.chat(projectId), methods.get);
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
  async create(projectId, task) {
    return await query(urls.task.create, methods.post, {
      project: projectId,
      ...task,
    });
  },

  async update(taskId, taskUpdate) {
    return await query(urls.task.details(taskId), methods.patch, taskUpdate);
  },

  async delete(taskId) {
    return await queryNoResponse(urls.task.details(taskId), methods.delete);
  },
};

//
// ChatMessage
//

export const chat = {
  async createMessage(projectId, text) {
    return await query(urls.chat, methods.post, {
      project: projectId,
      text,
    });
  },
};
