import { Dispatch } from "@reduxjs/toolkit";
import { getFirebase, FirebaseReducer } from "react-redux-firebase";

import type { UserProfile } from "../../features/auth";
import type { CounterState } from "../../features/counter/redux/slice";
import type { UserSettings } from "../../features/settings";
import type { UsersState } from "../../features/users/redux/types";

interface AppState {
  lastConnectedUId?: string;
}

interface FirestoreSchema {
  users: UserProfile;
  settings: UserSettings;
}

interface FirestoreState<T extends Record<string, any> = FirestoreSchema> {
  status: {
    requesting: { [P in keyof T]: boolean };
    requested: { [P in keyof T]: boolean };
    timestamps: { [P in keyof T]: number };
  };
  ordered: { [P in keyof T]: (T[P] & { id: string })[] };
  data: { [P in keyof T]: { [id: string]: T[P] } };
  listeners: any;
  errors: any;
  queries: any;
}

interface RootState {
  app: AppState;
  counter: CounterState;
  users: UsersState;
  firebase: FirebaseReducer.Reducer<UserProfile>;
  firestore: FirestoreState;
}

type AppThunkApiConfig = {
  state: RootState;
  dispatch: Dispatch;
  extra: { getFirebase: typeof getFirebase };
  rejectValue?: unknown;
};

export type {
  AppState,
  FirestoreState,
  FirestoreSchema,
  RootState,
  AppThunkApiConfig,
};
