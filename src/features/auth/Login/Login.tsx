import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { isEmpty, isLoaded, useFirebase } from "react-redux-firebase";

import { useAuth, useProfile } from "../hooks";
import { useLocation, useHistory } from "react-router-dom";

interface LoginLocationState {
  from: { pathname: string };
}

function Login() {
  const location = useLocation<LoginLocationState>();
  const history = useHistory();
  const firebase = useFirebase();

  const auth = useAuth();
  const profile = useProfile();

  const { from } = location.state || { from: { pathname: "/" } };

  async function loginWithGoogle() {
    await firebase.login({ provider: "google", type: "popup" });
    history.replace(from);
  }

  return (
    <div className="Login">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {!isLoaded(auth) ? (
        <Typography variant="body1">Loading...</Typography>
      ) : isEmpty(auth) || isEmpty(profile) ? (
        <Button color="primary" variant="contained" onClick={loginWithGoogle}>
          Login With Google
        </Button>
      ) : (
        <Button onClick={() => firebase.logout()}>Logout</Button>
      )}
    </div>
  );
}

export default Login;
