import firebase from "firebase";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFirebase } from "react-redux-firebase";

import slice from "../redux/slice";

type User = firebase.User;

const {
  actions: { updateLastConnectedUid },
} = slice;

function SyncLastConnectedUser() {
  const firebase = useFirebase();
  const dispatch = useDispatch();

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
