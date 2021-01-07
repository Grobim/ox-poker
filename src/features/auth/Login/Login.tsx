import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { isEmpty, isLoaded, useFirebase } from "react-redux-firebase";
import firebaseLib from "firebase/app";

import { useAuth } from "../hooks";

function Login() {
  const firebase = useFirebase();

  const auth = useAuth();

  async function loginWithGoogle() {
    const currentUser = firebase.auth().currentUser;

    if (!isEmpty(auth) && currentUser) {
      const googleProvider = new firebaseLib.auth.GoogleAuthProvider();
      await currentUser.linkWithRedirect(googleProvider);
    }
  }

  async function handleLogout() {
    return await firebase.auth().signInAnonymously();
  }

  return (
    <div className="Login">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {!isLoaded(auth) ? (
        <Typography variant="body1">Loading...</Typography>
      ) : isEmpty(auth) || auth.isAnonymous ? (
        <Button color="primary" variant="contained" onClick={loginWithGoogle}>
          Login With Google
        </Button>
      ) : (
        <Button onClick={handleLogout}>Logout</Button>
      )}
    </div>
  );
}

export default Login;
