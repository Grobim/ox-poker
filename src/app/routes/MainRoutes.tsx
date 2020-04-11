import React from "react";
import { Route, Switch } from "react-router-dom";

import { Role } from "../../features/auth";

import PrivateRoute from "./PrivateRoute";
import { loadableWithRefreshedStore } from "./loadableWithRefreshedStore";

const Home = loadableWithRefreshedStore(() =>
  import(/* webpackChunkName: "home" */ "../../features/home/Home")
);
const UserList = loadableWithRefreshedStore(() =>
  import(/* webpackChunkName: "userList" */ "../../features/users/UserList")
);
const Settings = loadableWithRefreshedStore(() =>
  import(/* webpackChunkName: "settings" */ "../../features/settings/Settings")
);
const Login = loadableWithRefreshedStore(() =>
  import(/* webpackChunkName: "login" */ "../../features/auth/Login")
);

function MainRoutes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <PrivateRoute path="/users" role={Role.ADMIN}>
        <UserList />
      </PrivateRoute>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
      <Route path="*">
        <div>404 mamène</div>
      </Route>
    </Switch>
  );
}

export default MainRoutes;