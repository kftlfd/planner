import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",

  initialState: {
    byProject: {},
  },

  reducers: {
    loadMessages(state, action) {
      const { projectId, messages } = action.payload;
      if (!state.byProject[projectId]) {
        state.byProject[projectId] = {
          messages,
          open: false,
          unread: 0,
          unreadIndex: null,
          loaded: true,
        };
      } else {
        state.byProject[projectId] = {
          ...state.byProject[projectId],
          messages,
          unreadIndex: messages.length - state.byProject[projectId].unread,
        };
      }
    },

    addMessage(state, action) {
      const { projectId, message, fromOthers } = action.payload;
      if (!state.byProject[projectId]) {
        state.byProject[projectId] = {
          messages: [],
          open: false,
          unread: 1,
          unreadIndex: 0,
          loaded: false,
        };
      }
      if (fromOthers && !state.byProject[projectId].open) {
        if (state.byProject[projectId].unreadIndex === null) {
          state.byProject[projectId].unreadIndex =
            state.byProject[projectId].messages.length;
        }
        state.byProject[projectId].unread++;
      }
      state.byProject[projectId].messages.push(message);
    },

    toggleChatOpen(state, action) {
      const projectId = action.payload;
      state.byProject[projectId].open = !state.byProject[projectId].open;
    },

    resetUnread(state, action) {
      const projectId = action.payload;
      state.byProject[projectId].unread = 0;
      state.byProject[projectId].unreadIndex = null;
    },
  },
});

export const { loadMessages, addMessage, toggleChatOpen, resetUnread } =
  chatSlice.actions;

export default chatSlice.reducer;

//
// selectors
//

export const selectProjectChat = (projectId) => (state) =>
  state.chat.byProject[projectId];
