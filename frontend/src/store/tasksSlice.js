import { createSlice } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
  name: "tasks",

  initialState: {
    items: {},
    idsByProject: {},
  },

  reducers: {
    loadTasks(state, action) {
      const { tasks, projectId, ids } = action.payload;
      state.items = {
        ...state.items,
        ...tasks,
      };
      state.idsByProject[projectId] = ids;
    },
    addTask(state, action) {
      const { task, projectId } = action.payload;
      state.items = {
        ...state.items,
        [task.id]: task,
      };
      state.idsByProject[projectId].push(task.id);
    },
    updateTask(state, action) {
      const task = action.payload;
      state.items[task.id] = {
        ...state.items[task.id],
        ...task,
      };
    },
    deleteTask(state, action) {
      const { projectId, taskId } = action.payload;
      delete state.items[taskId];
      state.idsByProject[projectId] = state.idsByProject[projectId].filter(
        (id) => id !== taskId
      );
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

export const selectProjectTasksIds = (projectId) => (state) =>
  state.tasks.idsByProject[projectId];

export const selectTaskById = (taskId) => (state) => state.tasks.items[taskId];
