import React from "react";
import { useDispatch, useSelector } from "react-redux";

import * as api from "../api/client";
import * as usersSlice from "../store/usersSlice";
import * as projectsSlice from "../store/projectsSlice";
import * as tasksSlice from "../store/tasksSlice";

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

  const user = {
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

  const project = {
    async loadProjects(userId) {
      const response = await api.projects.load(userId);
      const { projects, ownedIds, sharedIds, users } = response;
      dispatch(projectsSlice.loadProjects({ projects, ownedIds, sharedIds }));
      dispatch(usersSlice.loadUsers(users));
    },

    async create(name) {
      const p = await api.projects.create(name);
      dispatch(projectsSlice.addProject(p));
      dispatch(tasksSlice.loadTasks({ tasks: {}, projectId: p.id, ids: [] }));
      return p.id;
    },

    async update(projectId, update) {
      const p = await api.projects.update(projectId, update);
      ws.send("project/update", `${projectId}`, { project: p });
      dispatch(projectsSlice.updateProject(p));
    },

    async delete(projectId) {
      await api.projects.delete(projectId);
      ws.send("project/stopSharing", `${projectId}`, { projectId });
      dispatch(projectsSlice.deleteProject(projectId));
    },

    async leave(projectId) {
      await api.projects.leave(projectId);
      ws.send("project/removeMember", `${projectId}`, { projectId, userId });
      ws.leave([`${projectId}`]);
      dispatch(projectsSlice.deleteProject(projectId));
    },

    sharing: {
      async enable(projectId) {
        const p = await api.projects.sharing.enable(projectId);
        ws.join([`${projectId}`]);
        dispatch(projectsSlice.updateProject(p));
      },

      async disable(projectId) {
        const p = await api.projects.sharing.disable(projectId);
        ws.send("project/stopSharing", `${projectId}`, { projectId });
        ws.leave([`${projectId}`]);
        dispatch(projectsSlice.updateProject(p));
      },

      async recreateInvite(projectId) {
        const p = await api.projects.invite.recreate(projectId);
        dispatch(projectsSlice.updateProject(p));
      },

      async deleteInvite(projectId) {
        const p = await api.projects.invite.delete(projectId);
        dispatch(projectsSlice.updateProject(p));
      },
    },
  };

  const task = {
    async loadTasks(projectId) {
      const response = await api.tasks.load(projectId);
      const payload = {
        projectId,
        tasks: response,
        ids: Object.keys(response).map((id) => Number(id)),
      };
      dispatch(tasksSlice.loadTasks(payload));
    },

    async create(projectId, taskTitle) {
      const response = await api.tasks.create(projectId, taskTitle, userId);
      const payload = {
        task: response,
        projectId,
      };
      ws.send("task/create", `${payload.projectId}`, { payload });
      dispatch(tasksSlice.addTask(payload));
    },

    async update(taskId, taskUpdate) {
      const task = await api.tasks.update(taskId, taskUpdate);
      ws.send("task/update", `${task.project}`, { task });
      dispatch(tasksSlice.updateTask(task));
    },

    async delete(projectId, taskId) {
      await api.tasks.delete(taskId);
      ws.send("task/delete", `${projectId}`, { projectId, taskId });
      dispatch(tasksSlice.deleteTask({ projectId, taskId }));
    },
  };

  const invite = {
    async get(inviteCode) {
      const project = await api.invite.get(inviteCode);
      return project;
    },

    async join(inviteCode) {
      const project = await api.invite.post(inviteCode, "join");
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

  React.useEffect(() => {
    // setup websocket

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
        console.log(message);

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
                projectId: message.projectId,
                userId: message.userId,
              })
            );
            break;
          case "project/stopSharing":
            dispatch(projectsSlice.deleteProject(message.projectId));
            break;

          case "task/create":
            dispatch(tasksSlice.addTask(message.payload));
            break;
          case "task/update":
            dispatch(tasksSlice.updateTask(message.task));
            break;
          case "task/delete":
            dispatch(
              tasksSlice.deleteTask({
                projectId: message.projectId,
                taskId: message.taskId,
              })
            );
            break;
        }
      };

      ws.onerror = (e) => console.info("WS error: ", e);

      ws.onclose = (e) => console.info("WS closed");

      setWebSocket(ws);
    }
  }, [userId, projectsLoading]);

  return (
    <ActionsContext.Provider value={{ user, project, task, invite }}>
      {props.children}
    </ActionsContext.Provider>
  );
}
