import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/client";

const projectsSlice = createSlice({
  name: "projects",

  initialState: {
    items: {},
    ownedIds: [],
    sharedIds: [],
    sharingOnIds: [],
    loading: true,
    error: null,
  },

  reducers: {
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
  },

  extraReducers(builder) {
    builder
      .addCase(fetchProjects().fulfilled, (state, action) => {
        state.loading = false;
        const { projects, ownedIds, sharedIds } = action.payload;
        state.items = projects;
        state.ownedIds = ownedIds;
        state.sharedIds = sharedIds;
        let sharingOn = [];
        Object.keys(projects).forEach((id) => {
          if (projects[id].sharing) sharingOn.push(id);
        });
        state.sharingOnIds = sharingOn;
      })
      .addCase(fetchProjects().rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const fetchProjects = (userId) =>
  createAsyncThunk("projects/fetchProjects", async () => {
    return await api.projects.load(userId);
  });

export const {
  addProject,
  addSharedProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = projectsSlice.actions;

export default projectsSlice.reducer;

//
// selectors
//

export const selectLoadingProjects = (state) => state.projects.loading;

export const selectAllProjects = (state) => state.projects.items;

export const selectProjectIds = (state) => state.projects.ownedIds;

export const selectSharedProjectIds = (state) => state.projects.sharedIds;

export const selectSharingOnIds = (state) => state.projects.sharingOnIds;

export const selectProjectById = (projectId) => (state) =>
  state.projects.items[projectId];
