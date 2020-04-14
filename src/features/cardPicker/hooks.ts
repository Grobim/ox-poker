import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useFirestore,
  isLoaded,
  isEmpty,
  useFirestoreConnect,
  useFirebase,
} from "react-redux-firebase";
import firebaseLib from "firebase/app";

import { useProfile, useUserId } from "../auth";

import {
  selectActiveRoomMembers,
  selectCards,
  selectRooms,
  selectSelectedCard,
  selectUserRoomMember,
  selectActiveRoomReadyMembers,
} from "./redux/selectors";

const useCards = () => useSelector(selectCards);
const useSelectedCard = () => useSelector(selectSelectedCard);
const useRooms = () => useSelector(selectRooms);
const useActiveRoomMembers = () => useSelector(selectActiveRoomMembers);
const useUserRoomMember = () => useSelector(selectUserRoomMember);
const useActiveRoomReadyMembers = () =>
  useSelector(selectActiveRoomReadyMembers);

const useRoom = (roomId: string) => {
  const rooms = useRooms();

  return rooms && rooms[roomId];
};

const useRoomPresence = (roomId: string) => {
  const firestore = useFirestore();
  const firebase = useFirebase();

  const userId = useUserId();
  const profile = useProfile();

  const room = useRoom(roomId);
  const roomExists = isLoaded(room) && !isEmpty(room);

  useEffect(() => {
    if (roomExists && userId) {
      const userStatusDatabaseRef = firebase.ref(`/roomPresence/${userId}`);
      const memberRef = firestore
        .collection(`rooms/${roomId}/members`)
        .doc(userId);

      firebase.ref(".info/connected").on("value", (snapshot) => {
        if (!snapshot.val()) {
          memberRef.delete();
          return;
        }

        userStatusDatabaseRef
          .onDisconnect()
          .set({ timestamp: firebaseLib.database.ServerValue.TIMESTAMP })
          .then(() => {
            userStatusDatabaseRef.set({
              path: `/rooms/${roomId}/members/${userId}`,
              timestamp: firebaseLib.database.ServerValue.TIMESTAMP,
            });
            memberRef.set(
              {
                displayName: (profile && profile.displayName) || "",
                avatarUrl: null,
                isReady: false,
              },
              { merge: true }
            );
          });
      });

      return () => {
        memberRef.delete();
        firebase.ref(".info/connected").off("value");
        userStatusDatabaseRef.set({
          timestamp: firebaseLib.database.ServerValue.TIMESTAMP,
        });
      };
    }
  }, [firebase, firestore, roomExists, roomId, userId, profile]);
};

const useRoomConnect = (roomId: string) => {
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
  useRoomPresence(roomId);
};

export {
  useCards,
  useSelectedCard,
  useRoom,
  useRoomPresence,
  useRoomConnect,
  useActiveRoomMembers,
  useUserRoomMember,
  useActiveRoomReadyMembers,
};
