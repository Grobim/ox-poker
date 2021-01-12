import type { RootState, FirestoreState } from "./types";

function getSelectFirestoreDataOrOrdered(
  ordered?: false
): (state: RootState) => FirestoreState["data"];
function getSelectFirestoreDataOrOrdered(
  ordered?: true
): (state: RootState) => FirestoreState["ordered"];
function getSelectFirestoreDataOrOrdered(
  ordered: boolean = false
): (state: RootState) => FirestoreState["data"] | FirestoreState["ordered"] {
  return (state) => {
    if (ordered) {
      return state.firestore.ordered;
    } else {
      return state.firestore.data;
    }
  };
}

const selectHasFab = (state: RootState) => state.app.hasFab;

const selectLastConnectedUserId = (state: RootState) =>
  state.app.lastConnectedUId;

export {
  getSelectFirestoreDataOrOrdered,
  selectHasFab,
  selectLastConnectedUserId,
};
