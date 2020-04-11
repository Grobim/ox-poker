import { useSelector } from "react-redux";

import { selectCards, selectSelectedCard } from "./redux/selectors";

const useCards = () => useSelector(selectCards);
const useSelectedCard = () => useSelector(selectSelectedCard);

export { useCards, useSelectedCard };
