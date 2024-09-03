import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store/store";
import type { IProject } from "app/types/projects.types";
import { IUser } from "app/types/users.types";
import { ITask } from "app/types/tasks.types";

export type ProjectsState = {
  items: { [projectId: IProject["id"]]: IProject };
  ownedIds: IProject["id"][];
  sharedIds: IProject["id"][];
  sharingOnIds: string[];
  projectsTasksLoaded: IProject["id"][];
  loading: boolean;
  error: null | string;
  selectedCalDate: { [projectId: IProject["id"]]: Date };
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
      state.sharingOnIds = Object.keys(projects).filter(
        (id) => projects[Number(id)].sharing,
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
      delete state.items[projectId];
      state.ownedIds = state.ownedIds.filter((id) => id !== projectId);
      state.sharedIds = state.sharedIds.filter((id) => id !== projectId);
    },

    addMember(
      state,
      action: PayloadAction<{ projectId: IProject["id"]; userId: IUser["id"] }>,
    ) {
      const { projectId, userId } = action.payload;
      state.items[projectId].members.push(Number(userId));
    },
    removeMember(
      state,
      action: PayloadAction<{ projectId: IProject["id"]; userId: IUser["id"] }>,
    ) {
      const { projectId, userId } = action.payload;
      state.items[projectId].members = state.items[projectId].members.filter(
        (id) => id !== Number(userId),
      );
    },

    changeOwnedIdsOrder(state, action: PayloadAction<IProject["id"][]>) {
      state.ownedIds = action.payload;
    },
    changeSharedIdsOrder(state, action: PayloadAction<IProject["id"][]>) {
      state.sharedIds = action.payload;
    },

    addNewTask(state, action: PayloadAction<ITask>) {
      const task = action.payload;
      state.items[task.project].tasksOrder.push(task.id);
      state.items[task.project].board.none.push(task.id);
    },
    deleteTask(
      state,
      action: PayloadAction<{ projectId: IProject["id"]; taskId: ITask["id"] }>,
    ) {
      const { projectId, taskId } = action.payload;

      state.items[projectId].tasksOrder = state.items[
        projectId
      ].tasksOrder.filter((id) => id !== taskId);

      state.items[projectId].board.none = state.items[
        projectId
      ].board.none.filter((id) => id !== taskId);

      Object.keys(state.items[projectId].board.columns).forEach((col) => {
        state.items[projectId].board.columns[col].taskIds = state.items[
          projectId
        ].board.columns[col].taskIds.filter((id) => id !== taskId);
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
      state.items[projectId].tasksOrder = tasksOrder;
    },
    updateTasksBoard(
      state,
      action: PayloadAction<{
        projectId: IProject["id"];
        board: IProject["board"];
      }>,
    ) {
      const { projectId, board } = action.payload;
      state.items[projectId].board = board;
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
    state.projects.items[projectId].tasksOrder;

export const selectProjectBoard =
  (projectId: IProject["id"]) => (state: RootState) =>
    state.projects.items[projectId].board;

export const selectSelectedCalDate =
  (projectId: IProject["id"]) => (state: RootState) =>
    state.projects.selectedCalDate[projectId];
