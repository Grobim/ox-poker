import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useFirestore } from "react-redux-firebase";

import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

import { useUserId } from "../../auth";

import { RoomState } from "../redux/types";

function RoomCreator() {
  const history = useHistory();
  const firestore = useFirestore();

  const userId = useUserId();

  useEffect(() => {
    firestore
      .collection("rooms")
      .add({
        owner: userId,
        state: RoomState.LOBBY,
      })
      .then((newRoomRef) => {
        history.replace(`/online/${newRoomRef.id}`);
      });
  }, [firestore, history, userId]);

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
