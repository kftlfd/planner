import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store/store";
import type { ITask } from "app/types/tasks.types";

export type TasksState = {
  items: { [taskId: ITask["id"]]: ITask };
};

const initialState: TasksState = {
  items: {},
};

const tasksSlice = createSlice({
  name: "tasks",

  initialState,

  reducers: {
    loadTasks(state, action: PayloadAction<{ [taskId: ITask["id"]]: ITask }>) {
      state.items = {
        ...state.items,
        ...action.payload,
      };
    },

    addTask(state, action: PayloadAction<ITask>) {
      const task = action.payload;
      state.items = {
        ...state.items,
        [task.id]: task,
      };
    },

    updateTask(state, action: PayloadAction<ITask>) {
      const task = action.payload;
      state.items[task.id] = {
        ...state.items[task.id],
        ...task,
      };
    },

    deleteTask(state, action: PayloadAction<ITask["id"]>) {
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

export const selectAllTasks = (state: RootState) => state.tasks.items;

export const selectTaskById = (taskId: ITask["id"]) => (state: RootState) =>
  state.tasks.items[taskId];
