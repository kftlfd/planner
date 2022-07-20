import React from "react";
import { useDispatch } from "react-redux";

import * as api from "../api/client";
import * as projectsSlice from "../store/projectsSlice";
import * as tasksSlice from "../store/tasksSlice";

const ActionsContext = React.createContext();

export function useActions() {
  return React.useContext(ActionsContext);
}

export default function ProvideActions(props) {
  const dispatch = useDispatch();

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

    async deleteShared(projectId) {
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
    update(taskId, update) {},
  };

  return (
    <ActionsContext.Provider value={{ project, task }}>
      {props.children}
    </ActionsContext.Provider>
  );
}