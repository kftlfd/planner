import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { projects } from "../api/client";

//
// slice definition
//

const projectsSlice = createSlice({
  name: "projects",

  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'complete' | 'failed'
    error: null, // string | null
  },

  reducers: {
    addProject(state, action) {
      state.items.push(action.payload);
    },
    updateProject(state, action) {
      const { id } = action.payload;
      const p = state.items.find((p) => p.id === id);
      const idx = state.items.indexOf(p);
      state.items[idx] = action.payload;
    },
    deleteProject(state, action) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchProjects().pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchProjects().fulfilled, (state, action) => {
        state.status = "completed";
        state.items = action.payload;
      })
      .addCase(fetchProjects().rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addProject, updateProject, deleteProject } =
  projectsSlice.actions;

export default projectsSlice.reducer;

//
// selectors
//

export const selectAllProjects = (state) => state.projects.items;

export const selectProjectById = (projectId) => (state) =>
  state.projects.items.find((p) => p.id === projectId);

//
// api logic
//

export const fetchProjects = (userId) =>
  createAsyncThunk("projects/fetchProjects", async () => {
    return await projects.getAll(userId);
  });
