import React, { useMemo, useEffect } from "react";
import { isEmpty, isLoaded, useFirestore } from "react-redux-firebase";
import { Redirect, useParams } from "react-router-dom";
import firebase from "firebase/app";

import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";

import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import { useUserId } from "../../auth";

import { useConnectedRoom, useCards, useSelectedCard } from "../hooks";

import RoomLobby from "../RoomLobby";

import useStyles from "./Room.styles";
import { RoomState, SpecialCard } from "../redux/types";
import { useTheme } from "@material-ui/core";
import CardSelector from "../CardSelector";
import { useDispatch } from "react-redux";
import { setSelectedCard } from "../redux";
import RoomResults from "../RoomResults";

interface RoomHomeRouteParams {
  roomId: string;
}

function Room() {
  const dispatch = useDispatch();
  const firestore = useFirestore();

  const { roomId } = useParams<RoomHomeRouteParams>();

  const theme = useTheme();
  const classes = useStyles();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const userId = useUserId();

  const cards = useCards();
  const selectedCard = useSelectedCard();

  const { room, members, readyCount, userMember } = useConnectedRoom(roomId);

  const roomRef = useMemo(() => firestore.doc(`rooms/${roomId}`), [
    firestore,
    roomId,
  ]);
  const memberRef = useMemo(
    () => firestore.doc(`rooms/${roomId}/members/${userId}`),
    [firestore, roomId, userId]
  );

  const roomState = room && room.state;

  useEffect(() => {
    if (roomState === RoomState.PICKING) {
      dispatch(setSelectedCard());
      memberRef.update({
        selectedCard: firebase.firestore.FieldValue.delete(),
      });
    }
  }, [dispatch, memberRef, roomState]);

  if (!roomId || (isLoaded(room) && isEmpty(room))) {
    return <Redirect to="/online" />;
  }

  if (!isLoaded(room) || !members) {
    return null;
  }

  function handleCardSelect(card?: number | SpecialCard) {
    dispatch(setSelectedCard(card));
  }

  function handleStartPickingClick() {
    if (userMember.isReady) {
      roomRef.update({ state: RoomState.PICKING });
    } else {
      memberRef.update({ isReady: true });
    }
  }

  function handlePickedClick() {
    memberRef.update({ selectedCard });
  }

  function handleRevealClick() {
    roomRef.update({ state: RoomState.REVEALING });
  }

  return (
    <>
      {!userMember.isReady || room.state === RoomState.LOBBY ? (
        <RoomLobby
          roomId={roomId}
          roomState={room.state}
          userId={userId}
          members={members}
          readyCount={readyCount}
        />
      ) : userMember.isReady &&
        room.state === RoomState.PICKING &&
        typeof userMember.selectedCard === "undefined" ? (
        <CardSelector
          cards={cards}
          onSelect={handleCardSelect}
          selectedCard={selectedCard}
        />
      ) : (
        userMember.isReady &&
        (room.state === RoomState.REVEALING ||
          typeof userMember.selectedCard !== "undefined") && (
          <RoomResults
            userId={userId}
            members={members}
            hide={room.state === RoomState.PICKING}
          />
        )
      )}
      <Zoom
        in={
          !userMember.isReady ||
          room.state === RoomState.LOBBY ||
          room.state === RoomState.REVEALING
        }
        timeout={transitionDuration}
        style={{
          transitionDelay: `${
            !userMember.isReady ||
            room.state === RoomState.LOBBY ||
            room.state === RoomState.REVEALING
              ? theme.transitions.duration.leavingScreen
              : 0
          }ms`,
        }}
      >
        <Fab className={classes.fab} onClick={handleStartPickingClick}>
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
