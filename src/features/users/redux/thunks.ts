import { createAsyncThunk } from "@reduxjs/toolkit";
import { QuerySnapshot } from "@firebase/firestore-types";

import type { AppThunkApiConfig } from "../../../app/redux";

import type { UserProfile } from "../../auth";

import type { User } from "./types";

const fetchUsers = createAsyncThunk<User[], void, AppThunkApiConfig>(
  "users/fetchUsers",
  async (_, { extra: { getFirebase } }) => {
    const snapShot = (await getFirebase()
      .firestore()
      .collection("users")
      .get()) as QuerySnapshot<UserProfile>;

    const users: User[] = [];
    snapShot.forEach((user) => {
      users.push({
        ...user.data(),
        id: user.id,
      });
    });
    return users;
  }
);

export { fetchUsers };
