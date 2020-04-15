import { createSelector } from "@reduxjs/toolkit";
import pickBy from "lodash/pickBy";

import { RootState } from "../../../app/redux";

import { selectUserId } from "../../auth";

const selectCards = (state: RootState) => state.cardPicker.cards;
const selectSelectedCard = (state: RootState) => state.cardPicker.selectedCard;

const selectRooms = (state: RootState) => state.firestore.data.rooms;
const selectActiveRoomMembers = (state: RootState) =>
  state.firestore.data.activeRoomMembers;

const selectUserRoomMember = createSelector(
  [selectUserId, selectActiveRoomMembers],
  (userId, activeRoomMembers) => activeRoomMembers && activeRoomMembers[userId]
);

const selectActiveRoomReadyMembers = createSelector(
  [selectActiveRoomMembers],
  (members) => pickBy(members, (member) => member.isReady)
);

export {
  selectCards,
  selectSelectedCard,
  selectRooms,
  selectActiveRoomMembers,
  selectUserRoomMember,
  selectActiveRoomReadyMembers,
};
