import { IChatMessage } from "~/types/chat.types";
import { IProject } from "~/types/projects.types";
import { ITask } from "~/types/tasks.types";
import { IUser } from "~/types/users.types";

import {
  authQuery,
  baseWsUrl,
  methods,
  query,
  queryNoResponse,
  urls,
} from "./config";

//
// WS
//

export function getWS() {
  return new WebSocket(baseWsUrl);
}

//
// Auth
//

export const auth = {
  register(formData: FormData) {
    return authQuery(urls.auth.register, formData);
  },

  login(formData: FormData) {
    return authQuery(urls.auth.login, formData);
  },

  logout() {
    return authQuery(urls.auth.logout);
  },
};

//
// User
//

export const user = {
  async load() {
    return await query<IUser>(urls.auth.login, methods.post);
  },

  async update(
    userUpdate: Partial<IUser> &
      Partial<{
        ownedProjectsOrder: IProject["id"][];
        sharedProjectsOrder: IProject["id"][];
      }>,
  ) {
    return await query<IUser>(urls.user.details, methods.patch, userUpdate);
  },

  async password(passwords: { oldPassword: string; newPassword: string }) {
    return await query<IUser>(urls.user.password, methods.post, passwords);
  },

  async projects() {
    return await query<{
      projects: { [projectId: IProject["id"]]: IProject };
      sharedIds: IProject["id"][];
      ownedIds: IProject["id"][];
    }>(urls.user.projects, methods.get);
  },

  async deleteAccount() {
    return queryNoResponse(urls.user.details, methods.delete);
  },
};

//
// Project
//

export const project = {
  async create(projectName: string) {
    return await query<IProject>(urls.project.create, methods.post, {
      name: projectName,
    });
  },

  async update(projectId: IProject["id"], projectUpdate: Partial<IProject>) {
    return await query<IProject>(
      urls.project.details(`${projectId}`),
      methods.patch,
      projectUpdate,
    );
  },

  async delete(projectId: IProject["id"]) {
    return queryNoResponse(
      urls.project.details(`${projectId}`),
      methods.delete,
    );
  },

  async tasks(projectId: IProject["id"]) {
    return await query<{
      tasks: { [taskId: ITask["id"]]: ITask };
      members: { [userId: IUser["id"]]: IUser };
    }>(urls.project.tasks(`${projectId}`), methods.get);
  },

  async chat(projectId: IProject["id"]) {
    return await query<IChatMessage[]>(
      urls.project.chat(`${projectId}`),
      methods.get,
    );
  },

  sharing: {
    async enable(projectId: IProject["id"]) {
      return await query<IProject>(
        urls.project.sharing(`${projectId}`),
        methods.post,
        {
          sharing: "enable",
        },
      );
    },

    async disable(projectId: IProject["id"]) {
      return await query<IProject>(
        urls.project.sharing(`${projectId}`),
        methods.post,
        {
          sharing: "disable",
        },
      );
    },
  },

  invite: {
    async recreate(projectId: IProject["id"]) {
      return await query<IProject>(
        urls.project.sharing(`${projectId}`),
        methods.post,
        {
          invite: "recreate",
        },
      );
    },

    async delete(projectId: IProject["id"]) {
      return await query<IProject>(
        urls.project.sharing(`${projectId}`),
        methods.post,
        {
          invite: "delete",
        },
      );
    },
  },

  async leave(projectId: IProject["id"]) {
    return await query(urls.project.leave(`${projectId}`), methods.post);
  },
};

//
// Invite
//

export const invite = {
  async get(inviteCode: string) {
    return await query<{ project: IProject; owner: IUser }>(
      urls.project.join(inviteCode),
      methods.get,
    );
  },

  async join(inviteCode: string) {
    return await query<IProject>(urls.project.join(inviteCode), methods.post);
  },
};

//
// Task
//

export const task = {
  async create(projectId: IProject["id"], task: { title: string }) {
    return await query<ITask>(urls.task.create, methods.post, {
      project: projectId,
      ...task,
    });
  },

  async update(taskId: ITask["id"], taskUpdate: Partial<ITask>) {
    return await query<ITask>(
      urls.task.details(`${taskId}`),
      methods.patch,
      taskUpdate,
    );
  },

  async delete(taskId: ITask["id"]) {
    return queryNoResponse(urls.task.details(`${taskId}`), methods.delete);
  },
};

//
// ChatMessage
//

export const chat = {
  async createMessage(projectId: IProject["id"], text: string) {
    return await query<IChatMessage>(urls.chat, methods.post, {
      project: projectId,
      text,
    });
  },
};
