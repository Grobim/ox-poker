import React, { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { isEmpty, isLoaded, useFirestore } from "react-redux-firebase";
import { Redirect, useParams } from "react-router-dom";
import firebase from "firebase/app";

import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import { useTheme } from "@material-ui/core/styles";

import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import { useUserId } from "../../auth";

import {
  useActiveRoomMembers,
  useActiveRoomReadyMembers,
  useRoom,
  useRoomConnect,
  useSelectedCard,
  useUserRoomMember,
} from "../hooks";
import { setSelectedCard } from "../redux";
import { RoomState } from "../redux/types";

import CardSelector from "../CardSelector";
import RoomLobby from "../RoomLobby";
import RoomResults from "../RoomResults";

import useStyles from "./Room.styles";

interface RoomHomeRouteParams {
  roomId: string;
}

function Room() {
  const dispatch = useDispatch();
  const firestore = useFirestore();

  const { roomId } = useParams<RoomHomeRouteParams>();
  useRoomConnect(roomId);
  const room = useRoom(roomId);
  const members = useActiveRoomMembers();
  const userMember = useUserRoomMember();
  const readyMembers = useActiveRoomReadyMembers();

  const theme = useTheme();
  const classes = useStyles();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const userId = useUserId();

  const selectedCard = useSelectedCard();

  const roomRef = useMemo(() => firestore.doc(`rooms/${roomId}`), [
    firestore,
    roomId,
  ]);
  const userMemberRef = useMemo(
    () => firestore.doc(`rooms/${roomId}/members/${userId}`),
    [firestore, roomId, userId]
  );

  const roomState = room && room.state;

  useEffect(() => {
    if (roomState === RoomState.PICKING) {
      dispatch(setSelectedCard());
      userMemberRef.update({
        selectedCard: firebase.firestore.FieldValue.delete(),
      });
    }
  }, [dispatch, userMemberRef, roomState]);

  if (isLoaded(room) && isEmpty(room)) {
    return <Redirect to="/online" />;
  }

  if (
    !isLoaded(room) ||
    !isLoaded(members) ||
    !isLoaded(userMember) ||
    isEmpty(userMember)
  ) {
    return <div>Loading</div>;
  }

  function handleStartPickingClick() {
    roomRef.update({ state: RoomState.PICKING });
  }

  function handlePickedClick() {
    userMemberRef.update({ selectedCard });
  }

  function handleRevealClick() {
    roomRef.update({ state: RoomState.REVEALING });
  }

  return (
    <>
      {!userMember.isReady || room.state === RoomState.LOBBY ? (
        <RoomLobby
          room={room}
          roomRef={roomRef}
          members={members}
          readyCount={Object.keys(readyMembers).length}
          userMember={userMember}
          userMemberRef={userMemberRef}
        />
      ) : userMember.isReady &&
        room.state === RoomState.PICKING &&
        typeof userMember.selectedCard === "undefined" ? (
        <CardSelector />
      ) : (
        userMember.isReady &&
        (room.state === RoomState.REVEALING ||
          typeof userMember.selectedCard !== "undefined") && (
          <RoomResults
            userId={userId}
            members={readyMembers}
            hideResults={room.state === RoomState.PICKING}
          />
        )
      )}
      <Zoom
        in={!userMember.isReady || room.state !== RoomState.PICKING}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${
            !userMember.isReady || room.state !== RoomState.PICKING
              ? theme.transitions.duration.leavingScreen
              : 0
          }ms`,
        }}
      >
        <Fab
          disabled={!userMember.isReady}
          className={classes.fab}
          onClick={handleStartPickingClick}
        >
          <PlayArrowIcon />
        </Fab>
      </Zoom>
      <Zoom
        in={
          userMember.isReady &&
          room.state === RoomState.PICKING &&
          typeof userMember.selectedCard === "undefined"
        }
        timeout={transitionDuration}
        style={{
          transitionDelay: `${
            userMember.isReady &&
            room.state === RoomState.PICKING &&
            typeof userMember.selectedCard === "undefined"
              ? theme.transitions.duration.leavingScreen
              : 0
          }ms`,
        }}
      >
        <Fab
          className={classes.fab}
          disabled={typeof selectedCard === "undefined"}
          onClick={handlePickedClick}
        >
          <VisibilityOffIcon />
        </Fab>
      </Zoom>
      <Zoom
        in={
          userMember.isReady &&
          typeof userMember.selectedCard !== "undefined" &&
          room.state === RoomState.PICKING
        }
        timeout={transitionDuration}
        style={{
          transitionDelay: `${
            userMember.isReady &&
            typeof userMember.selectedCard !== "undefined" &&
            room.state === RoomState.PICKING
              ? theme.transitions.duration.leavingScreen
              : 0
          }ms`,
        }}
      >
        <Fab className={classes.fab} onClick={handleRevealClick}>
          <VisibilityIcon />
        </Fab>
      </Zoom>
    </>
  );
}

export type { RoomHomeRouteParams };
export default Room;
