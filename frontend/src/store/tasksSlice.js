import { createSlice } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
  name: "tasks",

  initialState: {
    items: {},
  },

  reducers: {
    loadTasks(state, action) {
      state.items = {
        ...state.items,
        ...action.payload,
      };
    },

    addTask(state, action) {
      const task = action.payload;
      state.items = {
        ...state.items,
        [task.id]: task,
      };
    },

    updateTask(state, action) {
      const task = action.payload;
      state.items[task.id] = {
        ...state.items[task.id],
        ...task,
      };
    },

    deleteTask(state, action) {
      const taskId = action.payload;
      delete state.items[taskId];
    },
  },
});

export const { loadTasks, addTask, updateTask, deleteTask } =
  tasksSlice.actions;

export default tasksSlice.reducer;

//
// selectors
//

export const selectAllTasks = (state) => state.tasks.items;

export const selectTaskById = (taskId) => (state) => state.tasks.items[taskId];
