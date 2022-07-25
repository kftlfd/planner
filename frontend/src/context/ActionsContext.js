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
  const userId = useSelector(usersSlice.selectUserId);
  const dispatch = useDispatch();

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
    async create(name) {
      const p = await api.projects.create(name);
      dispatch(projectsSlice.addProject(p));
      dispatch(tasksSlice.loadTasks({ tasks: {}, projectId: p.id, ids: [] }));
      return p.id;
    },

    async update(projectId, update) {
      const p = await api.projects.update(projectId, update);
      dispatch(projectsSlice.updateProject(p));
    },

    async delete(projectId) {
      await api.projects.delete(projectId);
      dispatch(projectsSlice.deleteProject(projectId));
    },

    async leave(projectId) {
      await api.projects.leave(projectId);
      dispatch(projectsSlice.deleteProject(projectId));
    },

    sharing: {
      async enable(projectId) {
        const p = await api.projects.sharing.enable(projectId);
        dispatch(projectsSlice.updateProject(p));
      },

      async disable(projectId) {
        const p = await api.projects.sharing.disable(projectId);
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
      dispatch(tasksSlice.addTask(payload));
    },

    async update(taskId, taskUpdate) {
      const task = await api.tasks.update(taskId, taskUpdate);
      dispatch(tasksSlice.updateTask(task));
    },

    async delete(projectId, taskId) {
      await api.tasks.delete(taskId);
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
      dispatch(projectsSlice.addSharedProject(project));
      return project;
    },
  };

  return (
    <ActionsContext.Provider value={{ user, project, task, invite }}>
      {props.children}
    </ActionsContext.Provider>
  );
}
