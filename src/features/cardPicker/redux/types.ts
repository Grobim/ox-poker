interface CardPickerState {
  cards: (number | SpecialCard)[];
  selectedCard?: number | SpecialCard;
}

enum SpecialCard {
  LONG = "LONG",
  PAUSE = "PAUSE",
}

export { SpecialCard };
export type { CardPickerState };
