import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { IChatMessage } from "~/types/chat.types";
import type { IProject } from "~/types/projects.types";

import type { RootState } from "./store";

export type Chat = {
  messages: IChatMessage[];
  open: boolean;
  unread: number;
  unreadIndex: number | null;
  loaded: boolean;
};

type ChatState = {
  byProject: Record<IProject["id"], Chat | undefined>;
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
      const chat = state.byProject[projectId];
      if (!chat) {
        state.byProject[projectId] = {
          messages,
          open: false,
          unread: 0,
          unreadIndex: null,
          loaded: true,
        };
        return;
      }
      state.byProject[projectId] = {
        ...chat,
        messages,
        unreadIndex: messages.length - chat.unread,
      };
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
      const chat = state.byProject[projectId] ?? {
        messages: [],
        open: false,
        unread: 1,
        unreadIndex: 0,
        loaded: false,
      };
      if (fromOthers && !chat.open) {
        if (chat.unreadIndex === null) {
          chat.unreadIndex = chat.messages.length;
        }
        chat.unread++;
      }
      chat.messages.push(message);
    },

    toggleChatOpen(state, action: PayloadAction<IProject["id"]>) {
      const projectId = action.payload;
      const chat = state.byProject[projectId];
      if (!chat) return;
      chat.open = !chat.open;
    },

    resetUnread(state, action: PayloadAction<IProject["id"]>) {
      const projectId = action.payload;
      const chat = state.byProject[projectId];
      if (!chat) return;
      chat.unread = 0;
      chat.unreadIndex = null;
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
