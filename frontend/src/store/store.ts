import { configureStore } from "@reduxjs/toolkit";

import chatReducer from "./chatSlice";
import { plannerApi } from "./plannerApi";
import projectsReducer from "./projectsSlice";
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
    [plannerApi.reducerPath]: plannerApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["projects/selectCalDate"],
        ignoredPaths: ["projects.selectedCalDate"],
      },
    }).concat(plannerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
