import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { ITask } from "~/types/tasks.types";

import type { RootState } from "./store";

export type TasksState = {
  items: Record<ITask["id"], ITask | undefined>;
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
      state.items[task.id] = { ...state.items[task.id], ...task };
    },

    deleteTask(state, action: PayloadAction<ITask["id"]>) {
      const taskId = action.payload;
      state.items = Object.fromEntries(
        Object.entries(state.items).filter(([id]) => Number(id) !== taskId),
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

export const selectAllTasks = (state: RootState) => state.tasks.items;

export const selectTaskById = (taskId: ITask["id"]) => (state: RootState) =>
  state.tasks.items[taskId];
