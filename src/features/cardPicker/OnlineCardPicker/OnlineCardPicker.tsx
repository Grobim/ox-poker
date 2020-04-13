import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  Link,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from "react-router-dom";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import storeManager from "../../../app/redux/StoreManager";

import { name, reducer } from "../redux/slice";

import Room from "../Room";
import RoomCreator from "../RoomCreator";

storeManager.registerReducers({
  [name]: reducer,
});

if (process.env.NODE_ENV !== "production") {
  if (module.hot) {
    module.hot.accept("../redux/slice", () => {
      storeManager.registerReducers({
        [name]: reducer,
      });
      storeManager.refreshStore();
    });
  }
}

function OnlineCardPicker() {
  const history = useHistory();
  const { path, url } = useRouteMatch();

  const [roomId, setRoomId] = useState("");

  function handleRoomIdChange(event: ChangeEvent<HTMLInputElement>) {
    setRoomId(event.target.value);
  }

  function handleRoomIdSubmit(event: FormEvent) {
    event.preventDefault();

    history.push(`${url}/${roomId}`);
  }

  return (
    <div className="OnlineCardPicker">
      <Typography variant="h4" gutterBottom>
        OnlineCardPicker
      </Typography>
      <Switch>
        <Route exact path={path}>
          <Grid container direction="column" spacing={5}>
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
              spacing={2}
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
        </Route>
        <Route path={`${path}/new-room`}>
          <RoomCreator />
        </Route>
        <Route path={`${path}/:roomId`}>
          <Room />
        </Route>
      </Switch>
    </div>
  );
}

export default OnlineCardPicker;
