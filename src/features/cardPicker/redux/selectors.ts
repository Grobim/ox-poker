import { RootState } from "../../../app/redux";

const selectCards = (state: RootState) => state.cardPicker.cards;
const selectSelectedCard = (state: RootState) => state.cardPicker.selectedCard;

const selectRooms = (state: RootState) => state.firestore.data.rooms;

export { selectCards, selectSelectedCard, selectRooms };
