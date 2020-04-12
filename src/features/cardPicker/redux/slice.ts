import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CardPickerState, SpecialCard } from "./types";

const initialState: CardPickerState = {
  cards: [1, 2, 3, 5, 8, 13, 21, 100, SpecialCard.LONG, SpecialCard.PAUSE],
};

const slice = createSlice({
  name: "cardPicker",
  initialState,
  reducers: {
    setSelectedCard: (
      state,
      { payload }: PayloadAction<number | SpecialCard | undefined>
    ) => {
      if (typeof payload === "undefined" || state.selectedCard === payload) {
        delete state.selectedCard;
      } else {
        state.selectedCard = payload;
      }
    },
    setCards: (state, { payload }: PayloadAction<number[]>) => {
      state.cards = [...payload, SpecialCard.LONG, SpecialCard.PAUSE];
    },
  },
});

export const { name, reducer } = slice;
export default slice;
