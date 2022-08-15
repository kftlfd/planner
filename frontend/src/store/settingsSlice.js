import { createSlice } from "@reduxjs/toolkit";

function readLocalStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (err) {
    console.info(err.message);
    return undefined;
  }
}

function setLocalStorage(key, val) {
  try {
    return window.localStorage.setItem(key, val);
  } catch (err) {
    console.info(err.message);
  }
}

const settingsSlice = createSlice({
  name: "settings",

  initialState: {
    theme: readLocalStorage("theme"),

    navDrawerOpen:
      readLocalStorage("navDrawerOpen") === "true"
        ? true
        : readLocalStorage("navDrawerOpen") === "false"
        ? false
        : null,

    hideDoneTasks: readLocalStorage("hideDoneTasks") === "true" ? true : false,

    projectView: readLocalStorage("projectView") || "list",

    boardColumnWidth: readLocalStorage("boardColumnWidth")
      ? Number(readLocalStorage("boardColumnWidth"))
      : 250,
  },

  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
      setLocalStorage("theme", action.payload);
    },

    toggleNavDrawer(state) {
      const open = !state.navDrawerOpen;
      state.navDrawerOpen = open;
      setLocalStorage("navDrawerOpen", open);
    },

    toggleHideDoneTasks(state) {
      const newVal = !state.hideDoneTasks;
      state.hideDoneTasks = newVal;
      setLocalStorage("hideDoneTasks", newVal ? "true" : "false");
    },

    setProjectView(state, action) {
      const view = action.payload;
      state.projectView = view;
      setLocalStorage("projectView", view);
    },

    setBoardColumnWidth(state, action) {
      const width = action.payload;
      state.boardColumnWidth = width;
      setLocalStorage("boardColumnWidth", width);
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

export const selectTheme = (state) => state.settings.theme;

export const selectNavDrawerOpen = (state) => state.settings.navDrawerOpen;

export const selectHideDoneTasks = (state) => state.settings.hideDoneTasks;

export const selectProjectView = (state) => state.settings.projectView;

export const selectBoardColumnWidth = (state) =>
  state.settings.boardColumnWidth;
