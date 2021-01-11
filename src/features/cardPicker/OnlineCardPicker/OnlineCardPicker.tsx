import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import storeManager from "../../../app/redux/StoreManager";

import { name, reducer } from "../redux/slice";

import RoomAltActions from "../RoomAltActions";
import RoomCopyAction from "../RoomCopyAction";
import RoomCreator from "../RoomCreator";
import RoomDispatch from "../RoomDispatch";
import RoomHome from "../RoomHome";

import useStyles from "./OnlineCardPicker.styles";

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
  const { path } = useRouteMatch();

  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      spacing={1}
      style={{ minHeight: "100%" }}
    >
      <Grid item container justify="space-between">
        <Grid item className={classes.titleContainer}>
          <Typography variant="h4" gutterBottom className={classes.title}>
            OnlineCardPicker
          </Typography>
          <Switch>
            <Route path={`${path}/new-room`}></Route>
            <Route path={`${path}/:roomId`}>
              <RoomCopyAction />
            </Route>
          </Switch>
        </Grid>
        <Grid item>
          <Switch>
            <Route path={`${path}/new-room`}></Route>
            <Route path={`${path}/:roomId`}>
              <RoomAltActions />
            </Route>
          </Switch>
        </Grid>
      </Grid>
      <Grid item>
        <Switch>
          <Route exact path={path}>
            <RoomHome />
          </Route>
          <Route path={`${path}/new-room`}>
            <RoomCreator />
          </Route>
          <Route path={`${path}/:roomId`}>
            <RoomDispatch />
          </Route>
        </Switch>
      </Grid>
    </Grid>
  );
}

export default OnlineCardPicker;
