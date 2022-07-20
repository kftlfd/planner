import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",

  initialState: {
    hideDoneTasks:
      window.localStorage.getItem("hideDoneTasks") === "true" ? true : false,
  },

  reducers: {
    toggleHideDoneTasks(state) {
      const newVal = !state.hideDoneTasks;
      state.hideDoneTasks = newVal;
      window.localStorage.setItem("hideDoneTasks", newVal ? "true" : "false");
    },
  },
});

export const { toggleHideDoneTasks } = settingsSlice.actions;

export default settingsSlice.reducer;

//
// selectors
//

export const selectHideDoneTasks = (state) => state.settings.hideDoneTasks;
