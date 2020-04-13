interface CardPickerState {
  cards: (number | SpecialCard)[];
  selectedCard?: number | SpecialCard;
}

enum SpecialCard {
  LONG = "LONG",
  PAUSE = "PAUSE",
}

interface Room {
  owner: string;
}

interface RoomMember {
  displayName: string;
  avatarUrl?: string;
  isReady: boolean;
}

export type { CardPickerState, Room, RoomMember };
export { SpecialCard };
