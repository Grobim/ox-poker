import React, { useCallback, useEffect, useState } from "react";
import { useFirestore } from "react-redux-firebase";
import firebase from "firebase/app";
import moment from "moment";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import type { Room } from "../../cardPicker/redux/types";

function AdminDashboard() {
  const firestore = useFirestore();

  const [isLoadingExpiredRooms, setIsLoadingExpiredRooms] = useState(false);
  const [expiredRooms, setExpiredRooms] = useState<Room[]>([]);

  const fetchExpiredRooms = useCallback(
    async function fetchExpiredRooms() {
      const maxLastSessionEnd = firebase.firestore.Timestamp.fromDate(
        moment().add(-1, "M").toDate()
      );

      setIsLoadingExpiredRooms(true);

      try {
        const usersSnap = await firestore
          .collection("/rooms")
          .where("lastSessionEnd", "<", maxLastSessionEnd)
          .get();

        setExpiredRooms(
          usersSnap.docs.map((userSnap) => userSnap.data() as Room)
        );
      } catch (error) {
        console.error("Could not get expired rooms", error);
      } finally {
        setIsLoadingExpiredRooms(false);
      }
    },
    [firestore]
  );

  useEffect(() => {
    fetchExpiredRooms();
  }, [fetchExpiredRooms]);

  async function onClearExpiredRoomsClick() {
    if (expiredRooms.length) {
      setIsLoadingExpiredRooms(true);
      const deleteExpiredRooms = firebase
        .app()
        .functions("europe-west1")
        .httpsCallable("deleteExpiredRooms");

      await deleteExpiredRooms();

      await fetchExpiredRooms();
    }
  }

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
      </Grid>
      <Grid item container spacing={1}>
        {isLoadingExpiredRooms ? (
          <Grid item xs={12}>
            <Typography>Loading expired rooms...</Typography>
          </Grid>
        ) : (
          <Grid item xs={12} container spacing={1} alignItems="center">
            <Grid item>
              <Typography>
                Expired rooms count : {expiredRooms.length}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                disabled={!expiredRooms.length}
                variant="contained"
                onClick={onClearExpiredRoomsClick}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default AdminDashboard;
