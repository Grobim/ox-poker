import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useFirestore,
  isLoaded,
  isEmpty,
  useFirestoreConnect,
} from "react-redux-firebase";
import filter from "lodash/filter";

import type { RootState, FirestoreSchema } from "../../app/redux";
import { useProfile, useUserId } from "../auth";

import {
  selectCards,
  selectRooms,
  selectSelectedCard,
} from "./redux/selectors";
import type { RoomMember } from "./redux/types";

const useCards = () => useSelector(selectCards);
const useSelectedCard = () => useSelector(selectSelectedCard);
const useRooms = () => useSelector(selectRooms);

const useRoom = (roomId: string) => {
  const rooms = useRooms();

  return rooms && rooms[roomId];
};

const useRegisterToRoom = (roomId: string) => {
  const firestore = useFirestore();

  const userId = useUserId();
  const profile = useProfile();

  const room = useRoom(roomId);
  const roomExists = isLoaded(room) && !isEmpty(room);

  useEffect(() => {
    if (roomExists && userId) {
      const memberRef = firestore
        .collection(`rooms/${roomId}/members`)
        .doc(userId);

      memberRef.set(
        {
          displayName: (profile && profile.displayName) || "",
          avatarUrl: null,
          isReady: false,
        },
        { merge: true }
      );

      return () => {
        memberRef.delete();
      };
    }
  }, [firestore, roomExists, roomId, userId, profile]);
};

interface FirestoreSchemaWithMembers extends FirestoreSchema {
  activeRoomMembers: RoomMember;
}

const useConnectedRoom = (roomId: string) => {
  useFirestoreConnect([
    {
      collection: "rooms",
      doc: roomId,
    },
    {
      collection: `/rooms/${roomId}/members`,
      storeAs: "activeRoomMembers",
    },
  ]);
  useRegisterToRoom(roomId);

  const userId = useUserId();

  const room = useRoom(roomId);
  const members = useSelector(
    (state: RootState<FirestoreSchemaWithMembers>) =>
      state.firestore.data.activeRoomMembers
  );

  const userMember = useMemo(
    () =>
      isLoaded(members) &&
      !isEmpty(members) &&
      !isEmpty(members[userId]) &&
      members[userId],
    [members, userId]
  ) as RoomMember;

  const readyCount = useMemo(
    () =>
      (isLoaded(members) &&
        filter(members, (member) => member.isReady).length) ||
      0,
    [members]
  );

  return {
    room,
    members,
    userMember,
    readyCount,
  };
};

export {
  useCards,
  useSelectedCard,
  useRoom,
  useRegisterToRoom,
  useConnectedRoom,
};
