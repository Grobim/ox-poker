import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";

import { fetchUsers } from "./redux/thunks";
import {
  selectFirestoreUsers,
  selectStoreUsers,
  selectToto,
} from "./redux/selectors";

const useFetchedUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return useSelector(selectStoreUsers);
};

const useSyncedUsers = () => {
  useFirestoreConnect("users");

  return useSelector(selectFirestoreUsers);
};

const useToto = () => useSelector(selectToto);

export { useFetchedUsers, useSyncedUsers, useToto };
