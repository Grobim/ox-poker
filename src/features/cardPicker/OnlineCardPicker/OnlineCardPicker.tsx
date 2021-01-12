import { Route, Switch, useRouteMatch } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import storeManager from "../../../app/redux/StoreManager";

import { name, reducer } from "../redux/slice";

import RoomAltActions from "../RoomAltActions";
import RoomCreator from "../RoomCreator";
import RoomDispatch from "../RoomDispatch";
import RoomHome from "../RoomHome";

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

  return (
    <Grid
      container
      direction="column"
      spacing={1}
      style={{ minHeight: "100%" }}
    >
      <Grid item container justify="space-between">
        <Grid item>
          <Typography variant="h4" gutterBottom>
            OnlineCardPicker
          </Typography>
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
