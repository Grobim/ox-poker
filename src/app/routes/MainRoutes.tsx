import React from "react";
import { Route, Switch } from "react-router-dom";

import { Role } from "../../features/auth";

import PrivateRoute from "./PrivateRoute";
import { loadableWithRefreshedStore } from "./loadableWithRefreshedStore";

const Home = loadableWithRefreshedStore(() =>
  import(/* webpackChunkName: "home" */ "../../features/home/Home")
);
const CardPicker = loadableWithRefreshedStore(() =>
  import(
    /* webpackChunkName: "cardPicker" */ "../../features/cardPicker/CardPicker"
  )
);
const OnlineCardPicker = loadableWithRefreshedStore(() =>
  import(
    /* webpackChunkName: "onlineCardPicker" */ "../../features/cardPicker/OnlineCardPicker"
  )
);
const AdminDashboard = loadableWithRefreshedStore(() =>
  import(
    /* webpackChunkName: "adminDashboard" */ "../../features/admin/AdminDashboard"
  )
);
const Profile = loadableWithRefreshedStore(() =>
  import(/* webpackChunkName: "profile" */ "../../features/profile/Profile")
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
      <Route exact path="/local">
        <CardPicker />
      </Route>
      <Route path="/online">
        <OnlineCardPicker />
      </Route>
      <PrivateRoute path="/admin" role={Role.ADMIN}>
        <AdminDashboard />
      </PrivateRoute>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/profile">
        <Profile />
      </Route>
      <Route path="*">
        <div>404 mamène</div>
      </Route>
    </Switch>
  );
}

export default MainRoutes;
