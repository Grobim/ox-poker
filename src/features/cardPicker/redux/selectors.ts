import { RootState } from "../../../app/redux";

const selectCards = (state: RootState) => state.cardPicker.cards;
const selectSelectedCard = (state: RootState) => state.cardPicker.selectedCard;

export { selectCards, selectSelectedCard };
