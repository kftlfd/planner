import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store/store";

function readLocalStorage(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch (err) {
    console.info(
      err instanceof Error ? err.message : "Error reading from localStorage"
    );
    return undefined;
  }
}

function setLocalStorage(key: string, val: string) {
  try {
    return window.localStorage.setItem(key, val);
  } catch (err) {
    console.info(
      err instanceof Error ? err.message : "Error writing to localStorage"
    );
  }
}

export type ProjectView = "list" | "board" | "calendar";

type SettingsState = {
  theme?: string | null;
  navDrawerOpen: boolean | null;
  hideDoneTasks: boolean;
  projectView: ProjectView;
  boardColumnWidth: number;
};

const initialState: SettingsState = {
  theme: readLocalStorage("theme"),

  navDrawerOpen:
    readLocalStorage("navDrawerOpen") === "true"
      ? true
      : readLocalStorage("navDrawerOpen") === "false"
      ? false
      : null,

  hideDoneTasks: readLocalStorage("hideDoneTasks") === "true" ? true : false,

  projectView: (readLocalStorage("projectView") as ProjectView) || "list",

  boardColumnWidth: readLocalStorage("boardColumnWidth")
    ? Number(readLocalStorage("boardColumnWidth"))
    : 250,
};

const settingsSlice = createSlice({
  name: "settings",

  initialState,

  reducers: {
    setTheme(state, action: PayloadAction<string>) {
      state.theme = action.payload;
      setLocalStorage("theme", action.payload);
    },

    toggleNavDrawer(state) {
      const open = !state.navDrawerOpen;
      state.navDrawerOpen = open;
      setLocalStorage("navDrawerOpen", `${open}`);
    },

    toggleHideDoneTasks(state) {
      const newVal = !state.hideDoneTasks;
      state.hideDoneTasks = newVal;
      setLocalStorage("hideDoneTasks", `${newVal}`);
    },

    setProjectView(state, action: PayloadAction<ProjectView>) {
      const view = action.payload;
      state.projectView = view;
      setLocalStorage("projectView", view);
    },

    setBoardColumnWidth(state, action: PayloadAction<number>) {
      const width = action.payload;
      state.boardColumnWidth = width;
      setLocalStorage("boardColumnWidth", `${width}`);
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
