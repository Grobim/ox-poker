import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useFirestore } from "react-redux-firebase";

import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

import { useUserId } from "../../auth";

import type { RoomLobbyRouteState } from "../RoomLobby";

import { useCards } from "../hooks";
import { RoomState } from "../redux/types";

function RoomCreator() {
  const history = useHistory<RoomLobbyRouteState>();
  const firestore = useFirestore();

  const cards = useCards();
  const userId = useUserId();

  useEffect(() => {
    firestore
      .collection("rooms")
      .add({
        owner: userId,
        state: RoomState.LOBBY,
        cards,
      })
      .then((newRoomRef) => {
        history.replace(`/online/${newRoomRef.id}`, { newRoom: true });
      });
  }, [firestore, history, userId, cards]);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography>Creating your new room ...</Typography>
      </Grid>
      <Grid item>
        <LinearProgress color="primary" />
      </Grid>
    </Grid>
  );
}

export default RoomCreator;
