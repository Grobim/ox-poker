import { createSlice } from "@reduxjs/toolkit";

import { fetchUsers } from "./thunks";
import type { UsersState } from "./types";

const initialState: UsersState = { users: [], toto: 0 };

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {
    inc: (state) => {
      state.toto++;
    },
    dec: (state) => {
      state.toto--;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, { payload }) => {
      state.users = payload;
    });
  },
});

export const { name, reducer } = slice;
export default slice;
