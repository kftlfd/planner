import { configureStore } from "@reduxjs/toolkit";

import settingsReducer from "./settingsSlice";
import projectsReducer from "./projectsSlice";
import tasksReducer from "./tasksSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
  },
});
