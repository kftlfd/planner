import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/client";

const usersSlice = createSlice({
  name: "users",

  initialState: {
    items: {},
    userId: null,
    loading: true,
    error: null,
  },

  reducers: {
    setUser(state, action) {
      const user = action.payload;
      state.userId = user.id;
      state.items[user.id] = user;
    },

    loadUsers(state, action) {
      state.items = {
        ...state.items,
        ...action.payload,
      };
    },

    updateUser(state, action) {
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

export const fetchUser = createAsyncThunk("users/fetchUser", async () => {
  return api.user.load();
});

export const { setUser, loadUsers, updateUser } = usersSlice.actions;

export default usersSlice.reducer;

//
// selectors
//

export const selectLoadingUser = (state) => state.users.loading;

export const selectUserId = (state) => state.users.userId;

export const selectUser = (state) => state.users.items[state.users.userId];

export const selectUserById = (userId) => (state) => state.users.items[userId];
