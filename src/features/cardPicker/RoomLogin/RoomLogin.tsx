import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Redirect, useParams } from "react-router-dom";
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

  const [isRegistering, setIsRegistering] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setError] = useState<{
    code: string;
    message: string;
  } | void>();
  const [password, setPassword] = useState("");

  const submitPassword = useCallback(
    async function submitPassword() {
      setError();

      const loginToRoom = firebase
        .app()
        .functions("europe-west1")
        .httpsCallable("loginToRoom");

      try {
        await loginToRoom({
          roomId,
          passwordHash: password && sha256.sdigest(password),
        });
      } catch (error) {
        setError(error);

        throw error;
      }
    },
    [password, roomId]
  );

  useEffect(() => {
    if (!requestError) {
      setIsRegistering(true);
      submitPassword()
        .then(() => {
          setIsRegistering(false);
          onSuccess();
        })
        .catch(() => {
          setIsRegistering(false);
        });
    }
  }, [submitPassword, onSuccess, requestError]);

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  async function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault();

    if (password && !isSubmitting) {
      setError();
      setIsSubmitting(true);
      return submitPassword()
        .then(() => {
          setIsSubmitting(false);
          onSuccess();
        })
        .catch(() => {
          setIsSubmitting(false);
        });
    }
  }

  if (!roomId || (requestError && requestError.code === "not-found")) {
    return <Redirect to="/online" />;
  }

  return (
    <Grid container direction="column" spacing={2}>
      {isRegistering ? (
        <>
          <Grid item>
            <Typography gutterBottom>Registering to the room ...</Typography>
          </Grid>
          <Grid item>
            <LinearProgress color="primary" />
          </Grid>
        </>
      ) : (
        <>
          <Grid item>
            <form noValidate autoComplete="off" onSubmit={handlePasswordSubmit}>
              <TextField
                value={password}
                onChange={handlePasswordChange}
                type="password"
                label="Password"
                fullWidth
                autoFocus
              />
            </form>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              disabled={isSubmitting}
              onClick={handlePasswordSubmit}
            >
              Login
            </Button>
          </Grid>
          {requestError && <pre>{JSON.stringify(requestError, null, 2)}</pre>}
        </>
      )}
    </Grid>
  );
}

export default RoomLogin;
