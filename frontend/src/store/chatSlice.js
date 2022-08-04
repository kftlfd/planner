import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",

  initialState: {
    byProject: {},
  },

  reducers: {
    loadMessages(state, action) {
      const { projectId, messages } = action.payload;
      state.byProject[projectId] = messages;
    },

    addMessage(state, action) {
      const { projectId, message } = action.payload;
      state.byProject[projectId].push(message);
    },
  },
});

export const { loadMessages, addMessage } = chatSlice.actions;

export default chatSlice.reducer;

//
// selectors
//

export const selectProjectChat = (projectId) => (state) =>
  state.chat.byProject[projectId];
