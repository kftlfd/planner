import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as api from "~/api/client";
import type { IUser } from "~/types/users.types";

import type { RootState } from "./store";

export type UsersState = {
  items: Record<IUser["id"], IUser | undefined>;
  userId: null | IUser["id"];
  loading: boolean;
  error: undefined | string;
};

const initialState: UsersState = {
  items: {},
  userId: null,
  loading: true,
  error: undefined,
};

const usersSlice = createSlice({
  name: "users",

  initialState,

  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      const user = action.payload;
      state.userId = user.id;
      state.items[user.id] = user;
    },

    loadUsers(state, action: PayloadAction<{ [userId: IUser["id"]]: IUser }>) {
      state.items = {
        ...state.items,
        ...action.payload,
      };
    },

    updateUser(state, action: PayloadAction<IUser>) {
      const user = action.payload;
      state.items[user.id] = {
        ...state.items[user.id],
        ...user,
      };
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload;
        state.userId = user.id;
        state.items[user.id] = user;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const fetchUser = createAsyncThunk("users/fetchUser", () =>
  api.user.load(),
);

export const { setUser, loadUsers, updateUser } = usersSlice.actions;

export default usersSlice.reducer;

//
// selectors
//

export const selectLoadingUser = (state: RootState) => state.users.loading;

export const selectUserId = (state: RootState) => state.users.userId;

export const selectUser = (state: RootState) =>
  state.users.userId !== null ? state.users.items[state.users.userId] : null;

export const selectUserById = (userId: IUser["id"]) => (state: RootState) =>
  state.users.items[userId];
