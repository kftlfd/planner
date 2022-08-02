import { createSlice } from "@reduxjs/toolkit";

const projectsSlice = createSlice({
  name: "projects",

  initialState: {
    items: {},
    ownedIds: [],
    sharedIds: [],
    sharingOnIds: [],
    projectsTasksLoaded: [],
    loading: true,
    error: null,
  },

  reducers: {
    loadProjects(state, action) {
      const { projects, ownedIds, sharedIds } = action.payload;
      state.loading = false;
      state.items = projects;
      state.ownedIds = ownedIds;
      state.sharedIds = sharedIds;
      state.sharingOnIds = Object.keys(projects).filter(
        (id) => projects[id].sharing
      );
    },

    updateTasksLoaded(state, action) {
      const projectId = action.payload;
      state.projectsTasksLoaded.push(Number(projectId));
    },

    addProject(state, action) {
      const project = action.payload;
      state.items[project.id] = project;
      state.ownedIds.push(project.id);
    },
    addSharedProject(state, action) {
      const project = action.payload;
      state.items[project.id] = project;
      state.sharedIds.push(project.id);
    },

    updateProject(state, action) {
      const project = action.payload;
      state.items[project.id] = {
        ...state.items[project.id],
        ...project,
      };
    },

    deleteProject(state, action) {
      const projectId = Number(action.payload);
      delete state.items[projectId];
      state.ownedIds = state.ownedIds.filter((id) => id !== projectId);
      state.sharedIds = state.sharedIds.filter((id) => id !== projectId);
    },

    addMember(state, action) {
      const { projectId, userId } = action.payload;
      state.items[projectId].members.push(Number(userId));
    },
    removeMember(state, action) {
      const { projectId, userId } = action.payload;
      state.items[projectId].members = state.items[projectId].members.filter(
        (id) => id !== Number(userId)
      );
    },

    changeOwnedIdsOrder(state, action) {
      state.ownedIds = action.payload;
    },
    changeSharedIdsOrder(state, action) {
      state.sharedIds = action.payload;
    },

    addNewTask(state, action) {
      const task = action.payload;
      state.items[task.project].tasksOrder.push(task.id);
      state.items[task.project].board.none.push(task.id);
    },
    deleteTask(state, action) {
      const task = action.payload;
      state.items[task.project].tasksOrder = state.items[
        task.project
      ].tasksOrder.filter((id) => id !== task.id);
      state.items[task.project].board.none = state.items[
        task.project
      ].board.none.filter((id) => id !== task.id);
      Object.keys(state.items[task.project].board.columns).forEach((col) => {
        state.items[task.project].board.columns[col] = state.items[
          task.project
        ].board.columns[col].filter((id) => id !== task.id);
      });
    },

    updateTasksOrder(state, action) {
      const { projectId, tasksOrder } = action.payload;
      state.items[projectId].tasksOrder = tasksOrder;
    },
    updateTasksBoard(state, action) {
      const { projectId, board } = action.payload;
      state.items[projectId].board = board;
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
} = projectsSlice.actions;

export default projectsSlice.reducer;

//
// selectors
//

export const selectLoadingProjects = (state) => state.projects.loading;

export const selectProjectaTasksLoaded = (state) =>
  state.projects.projectsTasksLoaded;

export const selectAllProjects = (state) => state.projects.items;

export const selectProjectIds = (state) => state.projects.ownedIds;

export const selectSharedProjectIds = (state) => state.projects.sharedIds;

export const selectSharingOnIds = (state) => state.projects.sharingOnIds;

export const selectProjectById = (projectId) => (state) =>
  state.projects.items[projectId];

export const selectProjectTasksIds = (projectId) => (state) =>
  state.projects.items[projectId].tasksOrder;

export const selectProjectBoard = (projectId) => (state) =>
  state.projects.items[projectId].board;
