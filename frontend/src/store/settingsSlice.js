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
  },
});

export const { toggleNavDrawer, toggleHideDoneTasks, setProjectView } =
  settingsSlice.actions;

export default settingsSlice.reducer;

//
// selectors
//

export const selectNavDrawerOpen = (state) => state.settings.navDrawerOpen;

export const selectHideDoneTasks = (state) => state.settings.hideDoneTasks;

export const selectProjectView = (state) => state.settings.projectView;
