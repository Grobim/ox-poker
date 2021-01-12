import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "./types";

const initialState: AppState = {
  hasFab: false,
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateHasFab: (state, { payload }: PayloadAction<boolean>) => {
      state.hasFab = payload;
    },
    updateLastConnectedUid: (state, { payload }: PayloadAction<string>) => {
      state.lastConnectedUId = payload;
    },
  },
});

export default slice;
