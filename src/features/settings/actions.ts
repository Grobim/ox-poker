import { createAsyncThunk } from "@reduxjs/toolkit";
import { isEmpty } from "react-redux-firebase";

import {
  AppThunkApiConfig,
  firestoreOverride,
  selectLastConnectedUserId,
} from "../../app/redux";

import { selectAuth, selectProfile } from "../auth";

import { UserSettings } from "./types";

const triggerUserSettingsUpdate = createAsyncThunk<
  void,
  Partial<UserSettings>,
  AppThunkApiConfig
>(
  "settings/triggerUserSettingsUpdate",
  async (userSettings, { getState, dispatch, extra: { getFirebase } }) => {
    const firestore = getFirebase().firestore();

    const auth = selectAuth(getState());
    const profile = selectProfile(getState());
    const lastConnectedUserId = selectLastConnectedUserId(getState());

    if (isEmpty(auth) || isEmpty(profile)) {
      dispatch(
        firestoreOverride({
          data: {
            settings: {
              [lastConnectedUserId || "undefined"]: userSettings,
            },
          },
        })
      );
    } else {
      return firestore
        .collection("settings")
        .doc(auth.uid)
        .set(userSettings, { merge: true });
    }
  }
);

export { triggerUserSettingsUpdate };
