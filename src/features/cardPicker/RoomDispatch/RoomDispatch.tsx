import React, { useEffect, useState } from "react";
import { isEmpty, isLoaded, useFirestore } from "react-redux-firebase";
import { Redirect, useParams } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

import { useAuth } from "../../auth";

import Room, { RoomRouteParams } from "../Room";
import RoomLogin from "../RoomLogin";

function RoomDispatch() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { roomId } = useParams<RoomRouteParams>();

  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<any>();

  useEffect(() => {
    if (isLoading && isLoaded(auth) && !isEmpty(auth)) {
      firestore
        .doc(`/rooms/${roomId}`)
        .get()
        .then(() => {
          setIsLoading(false);
          setHasAccess(true);
        })
        .catch((reqError) => {
          setIsLoading(false);
          setError(reqError);
        });
    }
  }, [firestore, isLoading, auth, roomId]);

  function handleLoginSuccess() {
    setError(undefined);
    setHasAccess(true);
  }

  if (hasAccess) {
    return <Room />;
  }

  if (error) {
    switch (error.code) {
      case "not-found":
        return <Redirect to="/online" />;
      case "permission-denied":
        return <RoomLogin onSuccess={handleLoginSuccess} />;
      default:
        break;
    }
  }

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography gutterBottom>Loading ...</Typography>
      </Grid>
      <Grid item>
        {isLoading ? (
          <LinearProgress color="primary" />
        ) : (
          <pre>{JSON.stringify(error, null, 2)}</pre>
        )}
      </Grid>
    </Grid>
  );
}

export default RoomDispatch;
