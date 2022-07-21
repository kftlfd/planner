import { configureStore } from "@reduxjs/toolkit";

import settingsReducer from "./settingsSlice";
import usersReducer from "./usersSlice";
import projectsReducer from "./projectsSlice";
import tasksReducer from "./tasksSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    users: usersReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
  },
});
