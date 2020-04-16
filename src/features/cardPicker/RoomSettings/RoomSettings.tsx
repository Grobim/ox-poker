import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import firebase from "firebase/app";

import Button from "@material-ui/core/Button";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import type { Room } from "../redux/types";

// @ts-ignore
import AsyncSha256 from "../AsyncSha256";

import useStyles from "./RoomSettings.styles";

// @ts-ignore
const sha256 = new AsyncSha256();

interface RoomSettingsProps {
  room: Room;
  expanded: boolean;
  onSave: (roomMember: firebase.firestore.UpdateData) => void;
  onCloseClick: () => void;
}

function RoomSettings({
  room,
  expanded,
  onSave,
  onCloseClick,
}: RoomSettingsProps) {
  const classes = useStyles();

  const header = <CardHeader title="Room Settings" />;

  const [roomName, setRoomName] = useState(room.displayName || "");
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    setRoomName(room.displayName || "");
  }, [room]);

  function handleRoomNameChange(event: ChangeEvent<HTMLInputElement>) {
    setRoomName(event.target.value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function handleCloseClick() {
    onCloseClick();
  }

  function handleSettingsSubmit(event: FormEvent) {
    event.preventDefault();

    saveRoom();
  }

  function saveRoom() {
    const roomChanges: firebase.firestore.UpdateData = {};

    if (roomName !== room.displayName) {
      roomChanges.displayName =
        roomName || firebase.firestore.FieldValue.delete();
    }

    if (typeof password === "string") {
      roomChanges.passwordHash = password
        ? sha256.sdigest(password)
        : firebase.firestore.FieldValue.delete();
    }

    const { passwordHash, ...roomRest } = room;

    onSave({
      ...roomRest,
      ...roomChanges,
    });
  }

  return (
    <>
      {expanded ? (
        header
      ) : (
        <CardActionArea onClick={handleCloseClick}>{header}</CardActionArea>
      )}
      <Collapse in={expanded} timeout="auto">
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleSettingsSubmit}
              >
                <TextField
                  value={roomName}
                  label="Name"
                  onChange={handleRoomNameChange}
                  onBlur={saveRoom}
                  fullWidth
                />
              </form>
            </Grid>
            <Grid item xs={12}>
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleSettingsSubmit}
              >
                <TextField
                  type="password"
                  value={password || ""}
                  label="Password"
                  onChange={handlePasswordChange}
                  onBlur={saveRoom}
                  fullWidth
                />
              </form>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            className={classes.closeButton}
            onClick={handleCloseClick}
          >
            Close
          </Button>
        </CardActions>
      </Collapse>
    </>
  );
}

export type { RoomSettingsProps };
export default RoomSettings;
