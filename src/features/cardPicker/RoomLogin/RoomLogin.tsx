import React, { useState, ChangeEvent, FormEvent } from "react";
import { useParams, Redirect } from "react-router-dom";
import firebase from "firebase/app";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import type { RoomRouteParams } from "../Room";

// @ts-ignore
import AsyncSha256 from "../AsyncSha256";

// @ts-ignore
const sha256 = new AsyncSha256();

interface RoomLoginProps {
  onSuccess: () => void;
}

function RoomLogin({ onSuccess }: RoomLoginProps) {
  const { roomId } = useParams<RoomRouteParams>();

  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setError] = useState<{
    code: string;
    message: string;
  } | void>();
  const [password, setPassword] = useState("");

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault();

    submitPassword();
  }

  function submitPassword() {
    if (password) {
      setIsLoading(true);
      setError();

      const loginToRoom = firebase
        .app()
        .functions("europe-west1")
        .httpsCallable("loginToRoom");

      loginToRoom({ roomId, passwordHash: sha256.sdigest(password) })
        .then(() => {
          setIsLoading(false);
          setError();
          onSuccess();
        })
        .catch((reqErr) => {
          setIsLoading(false);
          setError(reqErr);
        });
    }
  }

  if (!roomId) {
    return <Redirect to="/online" />;
  }

  return (
    <Grid container direction="column" spacing={2}>
      {isLoading ? (
        <>
          <Grid item>
            <Typography gutterBottom>Logging into the room ...</Typography>
          </Grid>
          <Grid item>
            <LinearProgress color="primary" />
          </Grid>
        </>
      ) : null}
      {requestError && (
        <>
          <Grid item>
            <form noValidate autoComplete="off" onSubmit={handlePasswordSubmit}>
              <TextField
                value={password}
                onChange={handlePasswordChange}
                type="password"
                label="Password"
                fullWidth
              />
            </form>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={submitPassword}>
              Login
            </Button>
          </Grid>
          <pre>{JSON.stringify(requestError, null, 2)}</pre>
        </>
      )}
    </Grid>
  );
}

export default RoomLogin;
