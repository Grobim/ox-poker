import React from "react";
import { isEmpty, isLoaded, useFirestore } from "react-redux-firebase";
import { useParams } from "react-router-dom";
import firebaseApp from "firebase/app";

import Fade from "@material-ui/core/Fade";
import IconButton from "@material-ui/core/IconButton";

import EditIcon from "@material-ui/icons/Edit";

import { useUserId } from "../../auth";

import { useRoom, useUserRoomMember } from "../hooks";
import { RoomState } from "../redux/types";

import type { RoomHomeRouteParams } from "../Room";

function RoomAltActions() {
  const firestore = useFirestore();

  const { roomId } = useParams<RoomHomeRouteParams>();
  const userId = useUserId();

  const room = useRoom(roomId);
  const userMember = useUserRoomMember();

  function handleEditClick() {
    firestore.doc(`/rooms/${roomId}/members/${userId}`).update({
      selectedCard: firebaseApp.firestore.FieldValue.delete(),
    });
  }

  if (
    !isLoaded(room) ||
    isEmpty(room) ||
    !isLoaded(userMember) ||
    isEmpty(userMember)
  ) {
    return null;
  }

  return (
    <Fade
      in={
        room.state === RoomState.PICKING &&
        typeof userMember.selectedCard !== "undefined"
      }
    >
      <IconButton onClick={handleEditClick}>
        <EditIcon />
      </IconButton>
    </Fade>
  );
}

export default RoomAltActions;
