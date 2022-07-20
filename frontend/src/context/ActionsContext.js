import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import * as api from "../api/client";
import * as projectsSlice from "../store/projectsSlice";
import * as tasksSlice from "../store/tasksSlice";

const ActionsContext = React.createContext();

export function useActions() {
  return React.useContext(ActionsContext);
}

export default function ProvideActions(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const project = {
    async create(name) {
      const p = await api.projects.create(name);
      dispatch(projectsSlice.addProject(p));
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
      navigate("/");
      dispatch(projectsSlice.deleteSharedProject(projectId));
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
