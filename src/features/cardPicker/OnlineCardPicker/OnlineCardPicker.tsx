import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import Typography from "@material-ui/core/Typography";

import storeManager from "../../../app/redux/StoreManager";

import { name, reducer } from "../redux/slice";

import Room from "../Room";
import RoomCreator from "../RoomCreator";
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
    <div className="OnlineCardPicker">
      <Typography variant="h4" gutterBottom>
        OnlineCardPicker
      </Typography>
      <Switch>
        <Route exact path={path}>
          <RoomHome />
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
