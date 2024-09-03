import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store/store";
import type { IProject } from "app/types/projects.types";
import type { IChatMessage } from "app/types/chat.types";

type ChatState = {
  byProject: {
    [projectId: IProject["id"]]: {
      messages: IChatMessage[];
      open: boolean;
      unread: number;
      unreadIndex: number | null;
      loaded: boolean;
    };
  };
};

const initialState: ChatState = {
  byProject: {},
};

const chatSlice = createSlice({
  name: "chat",

  initialState,

  reducers: {
    loadMessages(
      state,
      action: PayloadAction<{
        projectId: IProject["id"];
        messages: IChatMessage[];
      }>,
    ) {
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

    addMessage(
      state,
      action: PayloadAction<{
        projectId: IProject["id"];
        message: IChatMessage;
        fromOthers: boolean;
      }>,
    ) {
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

    toggleChatOpen(state, action: PayloadAction<IProject["id"]>) {
      const projectId = action.payload;
      state.byProject[projectId].open = !state.byProject[projectId].open;
    },

    resetUnread(state, action: PayloadAction<IProject["id"]>) {
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

export const selectProjectChat =
  (projectId: IProject["id"]) => (state: RootState) =>
    state.chat.byProject[projectId];
