import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import storeManager from "../../../app/redux/StoreManager";

import { useFetchedUsers, useSyncedUsers, useToto } from "../hooks";
import { inc, dec } from "../redux/actions";
import { name, reducer } from "../redux/slice";

storeManager.registerReducers({
  [name]: reducer,
});

if (process.env.NODE_ENV !== "production") {
  if (module.hot) {
    module.hot.accept("../redux/slice", () => {
      storeManager.registerReducers({
        [name]: reducer,
      });
      storeManager.refreshStore();
    });
  }
}

function UserList() {
  const history = useHistory();
  const dispatch = useDispatch();

  const fetchedUsers = useFetchedUsers();
  const syncedUsers = useSyncedUsers();
  const toto = useToto();

  function goBack() {
    history.goBack();
  }

  function handlePlus() {
    dispatch(inc());
  }

  function handleMinus() {
    dispatch(dec());
  }

  return (
    <div>
      <h3>UserList</h3>
      <div>
        {toto}
        <br />
        <button onClick={handleMinus}>-1</button>
        <button onClick={handlePlus}>+1</button>
      </div>
      <button onClick={goBack}>Back</button>
      <p>Fetched</p>
      <pre>{JSON.stringify(fetchedUsers, null, 2)}</pre>
      <p>Synced</p>
      <pre>{JSON.stringify(syncedUsers, null, 2)}</pre>
    </div>
  );
}

export default UserList;
