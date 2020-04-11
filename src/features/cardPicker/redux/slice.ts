import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CardPickerState, SpecialCard } from "./types";

const initialState: CardPickerState = {
  cards: [1, 2, 3, 5, 8, 13, 21, 100, SpecialCard.LONG, SpecialCard.PAUSE],
};

const slice = createSlice({
  name: "cardPicker",
  initialState,
  reducers: {
    selectCard: (state, { payload }: PayloadAction<number | SpecialCard>) => {
      state.selectedCard = payload;
    },
    resetSelectedCard: (state) => {
      delete state.selectedCard;
    },
  },
});

export const { name, reducer } = slice;
export default slice;
