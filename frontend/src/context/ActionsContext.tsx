import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import * as api from "~/api/client";
import * as chatSlice from "~/store/chatSlice";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import * as projectsSlice from "~/store/projectsSlice";
import * as settingsSlice from "~/store/settingsSlice";
import * as tasksSlice from "~/store/tasksSlice";
import * as usersSlice from "~/store/usersSlice";
import { IChatMessage } from "~/types/chat.types";
import { IProject } from "~/types/projects.types";
import { ITask } from "~/types/tasks.types";
import { IUser } from "~/types/users.types";

type Action =
  | { action: "group/join"; groups: string[] }
  | { action: "group/leave"; groups: string[] }
  | { action: "user/update"; user: IUser }
  | { action: "project/update"; project: IProject }
  | { action: "project/stopSharing"; projectId: number }
  | {
      action: "project/addMember";
      projectId: number;
      userId: number;
      userObj: IUser;
    }
  | { action: "project/removeMember"; userId: number; projectId?: number }
  | { action: "task/create"; newTask: ITask }
  | { action: "task/update"; task: ITask }
  | { action: "task/delete"; projectId: number; taskId: number }
  | {
      action: "chat/newMessage";
      projectId: number;
      message: IChatMessage;
      fromOthers: boolean;
    };

type WSMessage = { group: "all" | (string & {}) } & Action;

const newWSMessage = (msg: WSMessage) => JSON.stringify(msg);

const connectWebSocket = (
  idsToJoin: string[],
  dispatch: ReturnType<typeof useAppDispatch>,
) => {
  const socket = api.getWS();

  socket.onopen = () => {
    console.info("WS open");
    socket.send(
      newWSMessage({ group: "", action: "group/join", groups: idsToJoin }),
    );
  };

  socket.onmessage = ({ data: msgData }) => {
    const message = JSON.parse(msgData as string) as WSMessage;

    switch (message.action) {
      case "project/update":
        dispatch(projectsSlice.updateProject(message.project));
        break;
      case "project/addMember":
        dispatch(
          projectsSlice.addMember({
            projectId: message.projectId,
            userId: message.userId,
          }),
        );
        dispatch(
          usersSlice.loadUsers({ [message.userObj.id]: message.userObj }),
        );
        break;
      case "project/removeMember":
        dispatch(
          projectsSlice.removeMember({
            projectId: Number(message.group),
            userId: message.userId,
          }),
        );
        break;
      case "project/stopSharing":
        dispatch(projectsSlice.deleteProject(message.projectId));
        break;

      case "task/create":
        dispatch(tasksSlice.addTask(message.newTask));
        dispatch(projectsSlice.addNewTask(message.newTask));
        break;
      case "task/update":
        dispatch(tasksSlice.updateTask(message.task));
        break;
      case "task/delete":
        dispatch(tasksSlice.deleteTask(message.taskId));
        dispatch(
          projectsSlice.deleteTask({
            projectId: message.projectId,
            taskId: message.taskId,
          }),
        );
        break;

      case "chat/newMessage":
        dispatch(chatSlice.addMessage(message));
        break;

      case "user/update":
        dispatch(usersSlice.updateUser(message.user));
        break;
    }
  };

  socket.onerror = (e) => {
    console.info("WS error", e);
  };
  socket.onclose = (e) => {
    console.info("WS closed", e);
  };

  return socket;
};

class WS {
  constructor(private readonly webSocket: WebSocket | null) {}

  send(msg: WSMessage, retry = 1) {
    try {
      this.webSocket?.send(newWSMessage(msg));
    } catch (err) {
      if (retry > 0) {
        setTimeout(() => {
          this.send(msg, retry - 1);
        }, 2000);
      } else {
        console.error(err);
      }
    }
  }

  join(projectIds: string[]) {
    this.send({ group: "", action: "group/join", groups: projectIds });
  }

  leave(projectIds: string[]) {
    this.send({ group: "", action: "group/leave", groups: projectIds });
  }
}

const getWS = (webSocket: WebSocket | null) => new WS(webSocket);

const getActions = (
  dispatch: ReturnType<typeof useAppDispatch>,
  ws: WS,
  userObj: IUser | null,
  userId: number | null,
  setWebSocket: (ws: WebSocket) => void,
) => {
  //
  // Auth
  //

  const auth = {
    async register(formData: FormData) {
      const resp = await api.auth.register(formData);
      if (resp.ok && resp.user) dispatch(usersSlice.setUser(resp.user));
      return resp;
    },

    async login(formData: FormData) {
      const resp = await api.auth.login(formData);
      if (resp.ok && resp.user) dispatch(usersSlice.setUser(resp.user));
      return resp;
    },

    async logout() {
      await api.auth.logout();
      window.location.replace("/");
    },
  };

  //
  // User
  //

  const user = {
    async update(userUpdate: Partial<IUser>) {
      const updatedUser = await api.user.update(userUpdate);
      dispatch(usersSlice.updateUser(updatedUser));
      ws.send({ group: "all", action: "user/update", user: updatedUser });
      return updatedUser;
    },

    async changePassword(passwords: {
      oldPassword: string;
      newPassword: string;
    }) {
      return await api.user.password(passwords);
    },

    updateProjectsOrder(type: string, newOrder: IProject["id"][]) {
      if (type === "owned") {
        dispatch(projectsSlice.changeOwnedIdsOrder(newOrder));
        api.user
          .update({ ownedProjectsOrder: newOrder })
          .catch((err: unknown) => {
            console.error(err);
          });
      } else if (type === "shared") {
        dispatch(projectsSlice.changeSharedIdsOrder(newOrder));
        api.user
          .update({ sharedProjectsOrder: newOrder })
          .catch((err: unknown) => {
            console.error(err);
          });
      }
    },

    async deleteAccount() {
      if (userId !== null) {
        ws.send({ group: "all", action: "project/removeMember", userId });
      }
      await api.user.deleteAccount();
      window.location.replace("/");
    },
  };

  //
  // Project
  //

  const project = {
    async loadProjects() {
      const response = await api.user.projects();
      dispatch(projectsSlice.loadProjects(response));
      const { projects } = response;
      const sharingOn = Object.keys(projects).reduce(
        (arr: string[], id: string) => {
          const projectId = Number(id);
          if (projects[projectId]?.sharing) arr.push(id);
          return arr;
        },
        [],
      );
      setWebSocket(connectWebSocket(sharingOn, dispatch));
    },

    async create(name: IProject["name"]) {
      const p = await api.project.create(name);
      dispatch(projectsSlice.addProject(p));
      return p.id;
    },

    async update(projectId: IProject["id"], update: Partial<IProject>) {
      const project = await api.project.update(projectId, update);
      ws.send({ group: `${projectId}`, action: "project/update", project });
      dispatch(projectsSlice.updateProject(project));
    },

    updateTasksOrder(project: IProject) {
      dispatch(projectsSlice.updateProject(project));
      api.project.update(project.id, project).catch((err: unknown) => {
        console.error(err);
      });
      ws.send({ group: `${project.id}`, action: "project/update", project });
    },

    async delete(projectId: IProject["id"]) {
      await api.project.delete(projectId);
      ws.send({
        group: `${projectId}`,
        action: "project/stopSharing",
        projectId,
      });
      dispatch(projectsSlice.deleteProject(projectId));
    },

    async leave(projectId: IProject["id"]) {
      await api.project.leave(projectId);
      if (userId !== null) {
        ws.send({
          group: `${projectId}`,
          action: "project/removeMember",
          projectId,
          userId,
        });
      }
      ws.leave([`${projectId}`]);
      dispatch(projectsSlice.deleteProject(projectId));
    },

    sharing: {
      async enable(projectId: IProject["id"]) {
        const project = await api.project.sharing.enable(projectId);
        ws.join([`${projectId}`]);
        dispatch(projectsSlice.updateProject(project));
      },

      async disable(projectId: IProject["id"]) {
        const project = await api.project.sharing.disable(projectId);
        ws.send({
          group: `${projectId}`,
          action: "project/stopSharing",
          projectId,
        });
        ws.leave([`${projectId}`]);
        dispatch(projectsSlice.updateProject(project));
      },

      async recreateInvite(projectId: IProject["id"]) {
        const project = await api.project.invite.recreate(projectId);
        dispatch(projectsSlice.updateProject(project));
        ws.send({ group: `${projectId}`, action: "project/update", project });
      },

      async deleteInvite(projectId: IProject["id"]) {
        const project = await api.project.invite.delete(projectId);
        dispatch(projectsSlice.updateProject(project));
        ws.send({ group: `${projectId}`, action: "project/update", project });
      },
    },

    selectCalDate(projectId: IProject["id"], date: Date) {
      dispatch(projectsSlice.selectCalDate({ projectId, date }));
    },
  };

  //
  // Invite
  //

  const invite = {
    async get(inviteCode: string) {
      return await api.invite.get(inviteCode);
    },

    async join(inviteCode: string) {
      const project = await api.invite.join(inviteCode);
      ws.join([`${project.id}`]);
      if (userId !== null && userObj !== null) {
        ws.send({
          group: `${project.id}`,
          action: "project/addMember",
          projectId: project.id,
          userId,
          userObj,
        });
      }
      dispatch(projectsSlice.addSharedProject(project));
      return project;
    },
  };

  //
  // Task
  //

  const task = {
    async loadTasks(projectId: IProject["id"]) {
      const response = await api.project.tasks(projectId);
      const { tasks, members } = response;
      dispatch(tasksSlice.loadTasks(tasks));
      dispatch(usersSlice.loadUsers(members));
      dispatch(projectsSlice.updateTasksLoaded(projectId));
    },

    async create(projectId: IProject["id"], task: ITask) {
      const newTask = await api.task.create(projectId, task);
      ws.send({ group: `${newTask.project}`, action: "task/create", newTask });
      dispatch(tasksSlice.addTask(newTask));
      dispatch(projectsSlice.addNewTask(newTask));
    },

    async update(taskId: ITask["id"], taskUpdate: Partial<ITask>) {
      const task = await api.task.update(taskId, taskUpdate);
      ws.send({ group: `${task.project}`, action: "task/update", task });
      dispatch(tasksSlice.updateTask(task));
    },

    async delete(projectId: IProject["id"], taskId: ITask["id"]) {
      await api.task.delete(taskId);
      ws.send({
        group: `${projectId}`,
        action: "task/delete",
        projectId,
        taskId,
      });
      dispatch(tasksSlice.deleteTask(taskId));
      dispatch(projectsSlice.deleteTask({ projectId, taskId }));
    },
  };

  //
  // Chat
  //

  const chat = {
    async load(projectId: IProject["id"]) {
      const messages = await api.project.chat(projectId);
      dispatch(chatSlice.loadMessages({ projectId, messages }));
    },

    async newMessage(projectId: IProject["id"], text: string) {
      const message = await api.chat.createMessage(projectId, text);
      const payload = { projectId, message, fromOthers: false };
      dispatch(chatSlice.addMessage(payload));
      ws.send({
        group: `${projectId}`,
        action: "chat/newMessage",
        projectId,
        message,
        fromOthers: true,
      });
    },

    toggleChatOpen(projectId: IProject["id"]) {
      dispatch(chatSlice.toggleChatOpen(projectId));
    },

    resetUnread(projectId: IProject["id"]) {
      dispatch(chatSlice.resetUnread(projectId));
    },
  };

  //
  // Settings
  //

  const settings = {
    toggleNavDrawer() {
      dispatch(settingsSlice.toggleNavDrawer());
    },

    toggleHideDoneTasks() {
      dispatch(settingsSlice.toggleHideDoneTasks());
    },

    setProjectView(view: settingsSlice.ProjectView) {
      dispatch(settingsSlice.setProjectView(view));
    },

    setBoardColumnWidth(width: number) {
      dispatch(settingsSlice.setBoardColumnWidth(width));
    },
  };

  return { auth, user, project, invite, task, chat, settings };
};

type Actions = ReturnType<typeof getActions>;

const ActionsContext = createContext<Actions | null>(null);

export const useActions = () => {
  const ctx = useContext(ActionsContext);
  if (!ctx) throw new Error("Actions context not found");
  return ctx;
};

const ProvideActions: FC<{ children?: ReactNode }> = ({ children }) => {
  const userObj = useAppSelector(usersSlice.selectUser);
  const userId = useAppSelector(usersSlice.selectUserId);
  const dispatch = useAppDispatch();

  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      webSocket?.close();
    };
  }, [webSocket]);

  const ws = getWS(webSocket);

  const actions = getActions(dispatch, ws, userObj, userId, setWebSocket);

  return (
    <ActionsContext.Provider value={actions}>
      {children}
    </ActionsContext.Provider>
  );
};

export default ProvideActions;
