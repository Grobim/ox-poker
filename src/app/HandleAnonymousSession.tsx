import { useEffect } from "react";
import { isEmpty, isLoaded, useFirebase } from "react-redux-firebase";

import { useAuth } from "../features/auth";

function HandleAnonymousSession() {
  const firebase = useFirebase();

  const auth = useAuth();

  useEffect(() => {
    if (isLoaded(auth) && isEmpty(auth)) {
      firebase
        .auth()
        .signInAnonymously()
        .catch((error) => {
          console.error(error);
          throw error;
        });
    }
  }, [firebase, auth]);

  useEffect(() => {
    firebase
      .auth()
      .getRedirectResult()
      .then(async (redirectResult) => {
        const { user, credential, operationType } = redirectResult;

        if (
          operationType === "link" &&
          user &&
          credential &&
          user.providerData
        ) {
          let promise: Promise<any> = firebase
            .auth()
            .signInWithCredential(credential);
          const providerData = user.providerData;

          if (providerData && providerData[0]) {
            const data = providerData[0];

            return promise.then(() =>
              firebase.updateProfile(
                {
                  avatarUrl: data.photoURL,
                  displayName: data.displayName,
                  email: data.email,
                },
                { merge: true, useSet: true }
              )
            );
          }

          return promise;
        }
      })
      .catch((error) => {
        if (error.code === "auth/credential-already-in-use") {
          const prevUser = firebase.auth().currentUser;

          return firebase
            .auth()
            .signInWithCredential(error.credential)
            .then(() => prevUser?.delete());
        }
      });
  }, [firebase]);

  return null;
}

export default HandleAnonymousSession;
