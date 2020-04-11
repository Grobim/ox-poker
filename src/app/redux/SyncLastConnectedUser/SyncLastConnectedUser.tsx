import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFirebase, isEmpty } from "react-redux-firebase";
import { User } from "firebase";

import { useAuth } from "../../../features/auth";

import slice from "../slice";

const {
  actions: { updateLastConnectedUid },
} = slice;

function SyncLastConnectedUser() {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const auth = useAuth();

  useEffect(() => {
    if (isEmpty(auth)) {
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
    return firebase.auth().onAuthStateChanged((user: User | null) => {
      if (user) {
        dispatch(updateLastConnectedUid(user.uid));
      }
    });
  }, [firebase, dispatch]);

  return null;
}

export default SyncLastConnectedUser;
