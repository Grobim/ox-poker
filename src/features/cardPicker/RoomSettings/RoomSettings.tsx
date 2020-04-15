import React, { ChangeEvent, useEffect, useState } from "react";

import Button from "@material-ui/core/Button";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import type { Room } from "../redux/types";

import useStyles from "./RoomSettings.styles";

interface RoomSettingsProps {
  room: Room;
  expanded: boolean;
  onSave: (roomMember: Partial<Room>) => void;
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

  useEffect(() => {
    setRoomName(room.displayName || "");
  }, [room]);

  function handleRoomNameChange(event: ChangeEvent<HTMLInputElement>) {
    setRoomName(event.target.value);
  }

  function handleCloseClick() {
    onCloseClick();
  }

  function saveRoom() {
    onSave({
      displayName: roomName,
    });
  }

  return (
    <>
      {expanded ? (
        header
      ) : (
        <CardActionArea onClick={handleCloseClick}>{header}</CardActionArea>
      )}
      <Collapse in={expanded}>
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                value={roomName}
                label="Room name"
                onChange={handleRoomNameChange}
                onBlur={saveRoom}
                fullWidth
              />
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
