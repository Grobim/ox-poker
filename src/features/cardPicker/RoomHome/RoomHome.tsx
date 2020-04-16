import React, { ChangeEvent, FormEvent, useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

function RoomHome() {
  const history = useHistory();
  const { url } = useRouteMatch();

  const [roomId, setRoomId] = useState("");

  function handleRoomIdChange(event: ChangeEvent<HTMLInputElement>) {
    setRoomId(event.target.value);
  }

  function handleRoomIdSubmit(event: FormEvent) {
    event.preventDefault();

    history.push(`${url}/${roomId}`);
  }

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <Button
          component={Link}
          to={`${url}/new-room`}
          variant="contained"
          color="primary"
        >
          New online room
        </Button>
      </Grid>
      <Grid
        item
        container
        spacing={1}
        direction="column"
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleRoomIdSubmit}
      >
        <Grid item>
          <TextField
            value={roomId}
            onChange={handleRoomIdChange}
            placeholder="Room ID"
          />
        </Grid>
        <Grid item>
          <Button
            component={Link}
            to={`${url}/${roomId}`}
            variant="contained"
            disabled={!roomId}
          >
            Join online room
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default RoomHome;
