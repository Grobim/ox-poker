import { compose, PayloadAction, Reducer } from "@reduxjs/toolkit";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import {
  firebaseReducer,
  FirebaseReducer,
  ReactReduxFirebaseConfig,
  ReactReduxFirebaseProviderProps,
} from "react-redux-firebase";
import { createFirestoreInstance, firestoreReducer } from "redux-firestore";

import type { UserProfile } from "../../features/auth";

import { firestoreOverride } from "./actions";
import { reducers } from "./reducers";
import storeManager from "./StoreManager";
import type { FirestoreState } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyDAw9ZB4sJDvM6OXimiUNdXU3YPz1yrfnA",
  authDomain: "ox-poker.firebaseapp.com",
  databaseURL: "https://ox-poker.firebaseio.com",
  projectId: "ox-poker",
  storageBucket: "ox-poker.appspot.com",
  messagingSenderId: "916598577555",
  appId: "1:916598577555:web:8f707417edd333b6c7b066",
  measurementId: "G-E04HJJLM6Y",
};

firebase.initializeApp(firebaseConfig);

firebase.firestore();
firebase.functions();

function mergeOfflineOverride(next: Function) {
  return (state: any, action: PayloadAction<Record<string, unknown>>) => {
    const finalState =
      action.type === firestoreOverride.toString() && action.payload
        ? { ...state, ...action.payload }
        : state;
    return next(finalState, action);
  };
}

const getFirebaseStore = () => compose(mergeOfflineOverride)(firestoreReducer);

const getReducerMap = () => ({
  firebase: firebaseReducer as () => FirebaseReducer.Reducer<UserProfile>,
  firestore: getFirebaseStore() as Reducer<FirestoreState>,
  ...(reducers as typeof reducers),
});

storeManager.registerReducers(getReducerMap());
storeManager.refreshStore();

const store = storeManager.store;

if (process.env.NODE_ENV !== "production") {
  if (module.hot) {
    module.hot.accept("./reducers", () => {
      console.log("new reducer");
      storeManager.registerReducers(getReducerMap());
      storeManager.refreshStore();
    });
  }
}

const rrfConfig: Partial<ReactReduxFirebaseConfig> = {
  userProfile: "users",
  useFirestoreForProfile: true,
};

const rffProps: ReactReduxFirebaseProviderProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

export { store, rffProps };
