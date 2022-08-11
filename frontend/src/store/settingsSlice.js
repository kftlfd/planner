import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",

  initialState: {
    navDrawerOpen:
      window.localStorage.getItem("navDrawerOpen") === "true"
        ? true
        : window.localStorage.getItem("navDrawerOpen") === "false"
        ? false
        : null,
    hideDoneTasks:
      window.localStorage.getItem("hideDoneTasks") === "true" ? true : false,
    projectView: window.localStorage.getItem("projectView") || "list",
    boardColumnWidth: window.localStorage.getItem("boardColumnWidth")
      ? Number(window.localStorage.getItem("boardColumnWidth"))
      : 250,
  },

  reducers: {
    toggleNavDrawer(state) {
      const open = !state.navDrawerOpen;
      state.navDrawerOpen = open;
      window.localStorage.setItem("navDrawerOpen", open);
    },

    toggleHideDoneTasks(state) {
      const newVal = !state.hideDoneTasks;
      state.hideDoneTasks = newVal;
      window.localStorage.setItem("hideDoneTasks", newVal ? "true" : "false");
    },

    setProjectView(state, action) {
      const view = action.payload;
      state.projectView = view;
      window.localStorage.setItem("projectView", view);
    },

    setBoardColumnWidth(state, action) {
      const width = action.payload;
      state.boardColumnWidth = width;
      window.localStorage.setItem("boardColumnWidth", width);
    },
  },
});

export const {
  toggleNavDrawer,
  toggleHideDoneTasks,
  setProjectView,
  setBoardColumnWidth,
} = settingsSlice.actions;

export default settingsSlice.reducer;

//
// selectors
//

export const selectNavDrawerOpen = (state) => state.settings.navDrawerOpen;

export const selectHideDoneTasks = (state) => state.settings.hideDoneTasks;

export const selectProjectView = (state) => state.settings.projectView;

export const selectBoardColumnWidth = (state) =>
  state.settings.boardColumnWidth;
