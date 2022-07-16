import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { projects } from "../api/client";

const projectsSlice = createSlice({
  name: "projects",

  initialState: {
    items: {},
    ids: [],
    status: "idle", // 'idle' | 'loading' | 'complete' | 'failed'
    error: null, // string | null
  },

  reducers: {
    addProject(state, action) {
      const project = action.payload;
      state.items[project.id] = project;
      state.ids.push(String(project.id));
    },
    updateProject(state, action) {
      const project = action.payload;
      state.items[project.id] = {
        ...state.items[project.id],
        ...project,
      };
    },
    deleteProject(state, action) {
      const projectId = action.payload;
      delete state.items[projectId];
      state.ids = state.ids.filter((id) => id !== projectId);
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchProjects().pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchProjects().fulfilled, (state, action) => {
        state.status = "complete";
        state.items = action.payload;
        state.ids = Object.keys(action.payload);
      })
      .addCase(fetchProjects().rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const fetchProjects = (userId) =>
  createAsyncThunk("projects/fetchProjects", async () => {
    return await projects.load(userId);
  });

export const { addProject, updateProject, deleteProject } =
  projectsSlice.actions;

export default projectsSlice.reducer;

//
// selectors
//

export const selectAllProjects = (state) => state.projects.items;

export const selectProjectIds = (state) => state.projects.ids;

export const selectProjectById = (projectId) => (state) =>
  state.projects.items[projectId];
