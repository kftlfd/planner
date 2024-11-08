import { configureStore } from "@reduxjs/toolkit";

import chatReducer from "./chatSlice";
import projectsReducer from "./projectsSlice";
import apiSlice from "./queries/apiSlice";
import settingsReducer from "./settingsSlice";
import tasksReducer from "./tasksSlice";
import usersReducer from "./usersSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    users: usersReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    chat: chatReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["projects/selectCalDate"],
        ignoredPaths: ["projects.selectedCalDate"],
      },
    }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
