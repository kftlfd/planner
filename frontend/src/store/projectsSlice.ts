import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { IProject } from "~/types/projects.types";
import { ITask } from "~/types/tasks.types";
import { IUser } from "~/types/users.types";

import type { RootState } from "./store";

export type ProjectsState = {
  items: Record<IProject["id"], IProject | undefined>;
  ownedIds: IProject["id"][];
  sharedIds: IProject["id"][];
  sharingOnIds: string[];
  projectsTasksLoaded: IProject["id"][];
  loading: boolean;
  error: null | string;
  selectedCalDate: Record<IProject["id"], Date | undefined>;
};

const initialState: ProjectsState = {
  items: {},
  ownedIds: [],
  sharedIds: [],
  sharingOnIds: [],
  projectsTasksLoaded: [],
  loading: true,
  error: null,
  selectedCalDate: {},
};

const projectsSlice = createSlice({
  name: "projects",

  initialState,

  reducers: {
    loadProjects(
      state,
      action: PayloadAction<{
        projects: { [projectId: IProject["id"]]: IProject };
        sharedIds: IProject["id"][];
        ownedIds: IProject["id"][];
      }>,
    ) {
      const { projects, ownedIds, sharedIds } = action.payload;
      state.loading = false;
      state.items = projects;
      state.ownedIds = ownedIds;
      state.sharedIds = sharedIds;
      state.sharingOnIds = Object.entries(projects).reduce(
        (acc: string[], [id, project]) => {
          if (project.sharing) acc.push(id);
          return acc;
        },
        [],
      );
    },

    updateTasksLoaded(state, action: PayloadAction<IProject["id"]>) {
      const projectId = action.payload;
      state.projectsTasksLoaded.push(Number(projectId));
    },

    addProject(state, action: PayloadAction<IProject>) {
      const project = action.payload;
      state.items[project.id] = project;
      state.ownedIds.push(project.id);
    },
    addSharedProject(state, action: PayloadAction<IProject>) {
      const project = action.payload;
      state.items[project.id] = project;
      state.sharedIds.push(project.id);
    },

    updateProject(state, action: PayloadAction<IProject>) {
      const project = action.payload;
      state.items[project.id] = {
        ...state.items[project.id],
        ...project,
      };
    },

    deleteProject(state, action: PayloadAction<IProject["id"]>) {
      const projectId = Number(action.payload);
      state.items = Object.fromEntries(
        Object.entries(state.items).filter(([id]) => Number(id) !== projectId),
      );
      state.ownedIds = state.ownedIds.filter((id) => id !== projectId);
      state.sharedIds = state.sharedIds.filter((id) => id !== projectId);
    },

    addMember(
      state,
      action: PayloadAction<{ projectId: IProject["id"]; userId: IUser["id"] }>,
    ) {
      const { projectId, userId } = action.payload;
      state.items[projectId]?.members.push(Number(userId));
    },
    removeMember(
      state,
      action: PayloadAction<{ projectId: IProject["id"]; userId: IUser["id"] }>,
    ) {
      const { projectId, userId } = action.payload;
      const project = state.items[projectId];
      if (!project) return;
      project.members = project.members.filter((id) => id !== Number(userId));
    },

    changeOwnedIdsOrder(state, action: PayloadAction<IProject["id"][]>) {
      state.ownedIds = action.payload;
    },
    changeSharedIdsOrder(state, action: PayloadAction<IProject["id"][]>) {
      state.sharedIds = action.payload;
    },

    addNewTask(state, action: PayloadAction<ITask>) {
      const task = action.payload;
      state.items[task.project]?.tasksOrder.push(task.id);
      state.items[task.project]?.board.none.push(task.id);
    },
    deleteTask(
      state,
      action: PayloadAction<{ projectId: IProject["id"]; taskId: ITask["id"] }>,
    ) {
      const { projectId, taskId } = action.payload;
      const project = state.items[projectId];
      if (!project) return;

      project.tasksOrder = project.tasksOrder.filter((id) => id !== taskId);

      project.board.none = project.board.none.filter((id) => id !== taskId);

      Object.values(project.board.columns).forEach((column) => {
        column.taskIds = column.taskIds.filter((id) => id !== taskId);
      });
    },

    updateTasksOrder(
      state,
      action: PayloadAction<{
        projectId: IProject["id"];
        tasksOrder: ITask["id"][];
      }>,
    ) {
      const { projectId, tasksOrder } = action.payload;
      const project = state.items[projectId];
      if (!project) return;
      project.tasksOrder = tasksOrder;
    },
    updateTasksBoard(
      state,
      action: PayloadAction<{
        projectId: IProject["id"];
        board: IProject["board"];
      }>,
    ) {
      const { projectId, board } = action.payload;
      const project = state.items[projectId];
      if (!project) return;
      project.board = board;
    },

    selectCalDate(
      state,
      action: PayloadAction<{ projectId: IProject["id"]; date: Date }>,
    ) {
      const { projectId, date } = action.payload;
      state.selectedCalDate[projectId] = date;
    },
  },
});

export const {
  loadProjects,
  updateTasksLoaded,
  addProject,
  addSharedProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  changeOwnedIdsOrder,
  changeSharedIdsOrder,
  addNewTask,
  deleteTask,
  updateTasksOrder,
  updateTasksBoard,
  selectCalDate,
} = projectsSlice.actions;

export default projectsSlice.reducer;

//
// selectors
//

export const selectLoadingProjects = (state: RootState) =>
  state.projects.loading;

export const selectProjectaTasksLoaded = (state: RootState) =>
  state.projects.projectsTasksLoaded;

export const selectAllProjects = (state: RootState) => state.projects.items;

export const selectProjectIds = (state: RootState) => state.projects.ownedIds;

export const selectSharedProjectIds = (state: RootState) =>
  state.projects.sharedIds;

export const selectSharingOnIds = (state: RootState) =>
  state.projects.sharingOnIds;

export const selectProjectById =
  (projectId: IProject["id"]) => (state: RootState) =>
    state.projects.items[projectId];

export const selectProjectTasksIds =
  (projectId: IProject["id"]) => (state: RootState) =>
    state.projects.items[projectId]?.tasksOrder;

export const selectProjectBoard =
  (projectId: IProject["id"]) => (state: RootState) =>
    state.projects.items[projectId]?.board;

export const selectSelectedCalDate =
  (projectId: IProject["id"]) => (state: RootState) =>
    state.projects.selectedCalDate[projectId];
