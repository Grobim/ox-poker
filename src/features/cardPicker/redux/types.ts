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
  state: RoomState;
}

interface RoomMember {
  displayName: string;
  avatarUrl?: string;
  isReady: boolean;
  selectedCard?: number | SpecialCard;
}

enum RoomState {
  LOBBY = "LOBBY",
  PICKING = "PICKING",
  REVEALING = "REVEALING",
}

export type { CardPickerState, Room, RoomMember };
export { SpecialCard, RoomState };
