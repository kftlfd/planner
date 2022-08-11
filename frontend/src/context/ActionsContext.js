import React from "react";
import { useDispatch, useSelector } from "react-redux";

import * as api from "../api/client";
import * as usersSlice from "../store/usersSlice";
import * as projectsSlice from "../store/projectsSlice";
import * as tasksSlice from "../store/tasksSlice";
import * as settingsSlice from "../store/settingsSlice";
import * as chatSlice from "../store/chatSlice";

const ActionsContext = React.createContext();

export function useActions() {
  return React.useContext(ActionsContext);
}

export default function ProvideActions(props) {
  const userObj = useSelector(usersSlice.selectUser);
  const userId = useSelector(usersSlice.selectUserId);
  const projectsLoading = useSelector(projectsSlice.selectLoadingProjects);
  const sharingOnIds = useSelector(projectsSlice.selectSharingOnIds);
  const dispatch = useDispatch();

  const [webSocket, setWebSocket] = React.useState(null);

  const ws = {
    send(action, group, data) {
      if (webSocket.readyState === 1) {
        webSocket.send(
          JSON.stringify({
            action,
            group,
            ...data,
          })
        );
      }
    },

    join(projectIds) {
      this.send("group/join", "", { groups: projectIds });
    },

    leave(projectIds) {
      this.send("group/leave", "", { groups: projectIds });
    },
  };

  //
  // Auth
  //

  const auth = {
    async register(formData) {
      const resp = await api.auth.register(formData);
      if (resp.ok) dispatch(usersSlice.setUser(resp.user));
      else return resp;
    },

    async login(formData) {
      const resp = await api.auth.login(formData);
      if (resp.ok) dispatch(usersSlice.setUser(resp.user));
      else return resp;
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
    async update(userUpdate) {
      const updatedUser = await api.user.update(userUpdate);
      dispatch(usersSlice.updateUser(updatedUser));
      ws.send("user/update", "all", { user: updatedUser });
      return updatedUser;
    },

    async changePassword(passwords) {
      return await api.user.password(passwords);
    },

    async updateProjectsOrder(type, newOrder) {
      if (type === "owned") {
        dispatch(projectsSlice.changeOwnedIdsOrder(newOrder));
        api.user.update({ ownedProjectsOrder: newOrder });
      } else if (type === "shared") {
        dispatch(projectsSlice.changeSharedIdsOrder(newOrder));
        api.user.update({ sharedProjectsOrder: newOrder });
      }
    },

    async deleteAccount() {
      ws.send("project/removeMember", "all", { userId });
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
    },

    async create(name) {
      const p = await api.project.create(name);
      dispatch(projectsSlice.addProject(p));
      ws.join([p.id]);
      return p.id;
    },

    async update(projectId, update) {
      const project = await api.project.update(projectId, update);
      ws.send("project/update", `${projectId}`, { project });
      dispatch(projectsSlice.updateProject(project));
    },

    async updateTasksOrder(project) {
      dispatch(projectsSlice.updateProject(project));
      api.project.update(project.id, project);
      ws.send("project/update", `${project.id}`, { project });
    },

    async delete(projectId) {
      await api.project.delete(projectId);
      ws.send("project/stopSharing", `${projectId}`, { projectId });
      dispatch(projectsSlice.deleteProject(projectId));
    },

    async leave(projectId) {
      await api.project.leave(projectId);
      ws.send("project/removeMember", `${projectId}`, { projectId, userId });
      ws.leave([`${projectId}`]);
      dispatch(projectsSlice.deleteProject(projectId));
    },

    sharing: {
      async enable(projectId) {
        const project = await api.project.sharing.enable(projectId);
        ws.join([`${projectId}`]);
        dispatch(projectsSlice.updateProject(project));
      },

      async disable(projectId) {
        const project = await api.project.sharing.disable(projectId);
        ws.send("project/stopSharing", `${projectId}`, { projectId });
        ws.leave([`${projectId}`]);
        dispatch(projectsSlice.updateProject(project));
      },

      async recreateInvite(projectId) {
        const project = await api.project.invite.recreate(projectId);
        dispatch(projectsSlice.updateProject(project));
      },

      async deleteInvite(projectId) {
        const project = await api.project.invite.delete(projectId);
        dispatch(projectsSlice.updateProject(project));
      },
    },

    selectCalDate(projectId, date) {
      dispatch(projectsSlice.selectCalDate({ projectId, date }));
    },
  };

  //
  // Invite
  //

  const invite = {
    async get(inviteCode) {
      return await api.invite.get(inviteCode);
    },

    async join(inviteCode) {
      const project = await api.invite.join(inviteCode);
      ws.join([`${project.id}`]);
      ws.send("project/addMember", `${project.id}`, {
        projectId: project.id,
        userId,
        userObj,
      });
      dispatch(projectsSlice.addSharedProject(project));
      return project;
    },
  };

  //
  // Task
  //

  const task = {
    async loadTasks(projectId) {
      const response = await api.project.tasks(projectId);
      const { tasks, members } = response;
      dispatch(tasksSlice.loadTasks(tasks));
      dispatch(usersSlice.loadUsers(members));
      dispatch(projectsSlice.updateTasksLoaded(projectId));
    },

    async create(projectId, task) {
      const newTask = await api.task.create(projectId, task);
      ws.send("task/create", `${task.project}`, { newTask });
      dispatch(tasksSlice.addTask(newTask));
      dispatch(projectsSlice.addNewTask(newTask));
    },

    async update(taskId, taskUpdate) {
      const task = await api.task.update(taskId, taskUpdate);
      ws.send("task/update", `${task.project}`, { task });
      dispatch(tasksSlice.updateTask(task));
    },

    async delete(taskId) {
      await api.task.delete(taskId);
      ws.send("task/delete", `${task.project}`, { task });
      dispatch(tasksSlice.deleteTask(task));
      dispatch(projectsSlice.deleteTask(task));
    },
  };

  //
  // Chat
  //

  const chat = {
    async load(projectId) {
      const messages = await api.project.chat(projectId);
      dispatch(chatSlice.loadMessages({ projectId, messages }));
    },

    async newMessage(projectId, text) {
      const message = await api.chat.createMessage(projectId, text);
      const payload = { projectId, message, fromOthers: false };
      dispatch(chatSlice.addMessage(payload));
      ws.send("chat/newMessage", `${projectId}`, {
        projectId,
        message,
        fromOthers: true,
      });
    },

    toggleChatOpen(projectId) {
      dispatch(chatSlice.toggleChatOpen(projectId));
    },

    resetUnread(projectId) {
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

    setProjectView(view) {
      dispatch(settingsSlice.setProjectView(view));
    },

    setBoardColumnWidth(width) {
      dispatch(settingsSlice.setBoardColumnWidth(width));
    },
  };

  //
  // WebSocket
  //

  React.useEffect(() => {
    if (webSocket) webSocket.close();

    if (userId !== null && !projectsLoading) {
      const ws = new WebSocket(`ws://${window.location.host}/ws/`);

      // join groups on connection
      ws.onopen = (e) => {
        console.info("WS open");
        ws.send(
          JSON.stringify({
            action: "group/join",
            groups: sharingOnIds,
          })
        );
      };

      ws.onmessage = ({ data }) => {
        const message = JSON.parse(data);

        switch (message.action) {
          case "project/update":
            dispatch(projectsSlice.updateProject(message.project));
            break;
          case "project/addMember":
            dispatch(
              projectsSlice.addMember({
                projectId: message.projectId,
                userId: message.userId,
              })
            );
            dispatch(
              usersSlice.loadUsers({ [message.userObj.id]: message.userObj })
            );
            break;
          case "project/removeMember":
            dispatch(
              projectsSlice.removeMember({
                projectId: message.group,
                userId: message.userId,
              })
            );
            break;
          case "project/stopSharing":
            dispatch(projectsSlice.deleteProject(message.projectId));
            break;

          case "task/create":
            dispatch(tasksSlice.addTask(message.task));
            dispatch(projectsSlice.addNewTask(message.task));
            break;
          case "task/update":
            dispatch(tasksSlice.updateTask(message.task));
            break;
          case "task/delete":
            dispatch(tasksSlice.deleteTask(message.task));
            dispatch(projectsSlice.deleteTask(message.task));
            break;

          case "chat/newMessage":
            dispatch(chatSlice.addMessage(message));
            break;

          case "user/update":
            dispatch(usersSlice.updateUser(message.user));
            break;
        }
      };

      ws.onerror = (e) => console.info("WS error: ", e);

      ws.onclose = (e) => console.info("WS closed");

      setWebSocket(ws);
    }
  }, [userId, projectsLoading]);

  return (
    <ActionsContext.Provider
      value={{ auth, user, project, task, invite, chat, settings }}
    >
      {props.children}
    </ActionsContext.Provider>
  );
}
