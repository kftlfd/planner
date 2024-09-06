import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { PaletteMode } from "@mui/material";

import type { RootState } from "./store";

function readLocalStorage(key: string, defaultValue = null) {
  try {
    return window.localStorage.getItem(key);
  } catch (err) {
    console.info(
      err instanceof Error ? err.message : "Error reading from localStorage",
    );
    return defaultValue;
  }
}

function setLocalStorage(key: string, val: string) {
  try {
    window.localStorage.setItem(key, val);
    return;
  } catch (err) {
    console.info(
      err instanceof Error ? err.message : "Error writing to localStorage",
    );
  }
}

type Theme = PaletteMode;

const getLSTheme = (): Theme | undefined => {
  const theme = readLocalStorage("theme") as PaletteMode | null;
  const validThemes: PaletteMode[] = ["light", "dark"];
  if (!theme || !validThemes.includes(theme)) {
    return undefined;
  }
  return theme;
};

const getLSProjectView = (): ProjectView => {
  const projectView = readLocalStorage("projectView") as ProjectView | null;
  const validValues: ProjectView[] = ["list", "board", "calendar"];
  if (!projectView || !validValues.includes(projectView)) {
    return "list";
  }
  return projectView;
};

export type ProjectView = "list" | "board" | "calendar";

type SettingsState = {
  theme?: Theme;
  navDrawerOpen: boolean | null;
  hideDoneTasks: boolean;
  projectView: ProjectView;
  boardColumnWidth: number;
};

const initialState: SettingsState = {
  theme: getLSTheme(),

  navDrawerOpen:
    readLocalStorage("navDrawerOpen") === "true"
      ? true
      : readLocalStorage("navDrawerOpen") === "false"
        ? false
        : null,

  hideDoneTasks: readLocalStorage("hideDoneTasks") === "true" ? true : false,

  projectView: getLSProjectView(),

  boardColumnWidth: readLocalStorage("boardColumnWidth")
    ? Number(readLocalStorage("boardColumnWidth"))
    : 250,
};

const settingsSlice = createSlice({
  name: "settings",

  initialState,

  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      setLocalStorage("theme", action.payload);
    },

    toggleNavDrawer(state) {
      const open = !state.navDrawerOpen;
      state.navDrawerOpen = open;
      setLocalStorage("navDrawerOpen", String(open));
    },

    toggleHideDoneTasks(state) {
      const newVal = !state.hideDoneTasks;
      state.hideDoneTasks = newVal;
      setLocalStorage("hideDoneTasks", String(newVal));
    },

    setProjectView(state, action: PayloadAction<ProjectView>) {
      const view = action.payload;
      state.projectView = view;
      setLocalStorage("projectView", view);
    },

    setBoardColumnWidth(state, action: PayloadAction<number>) {
      const width = action.payload;
      state.boardColumnWidth = width;
      setLocalStorage("boardColumnWidth", String(width));
    },
  },
});

export const {
  setTheme,
  toggleNavDrawer,
  toggleHideDoneTasks,
  setProjectView,
  setBoardColumnWidth,
} = settingsSlice.actions;

export default settingsSlice.reducer;

//
// selectors
//

export const selectTheme = (state: RootState) => state.settings.theme;

export const selectNavDrawerOpen = (state: RootState) =>
  state.settings.navDrawerOpen;

export const selectHideDoneTasks = (state: RootState) =>
  state.settings.hideDoneTasks;

export const selectProjectView = (state: RootState) =>
  state.settings.projectView;

export const selectBoardColumnWidth = (state: RootState) =>
  state.settings.boardColumnWidth;
