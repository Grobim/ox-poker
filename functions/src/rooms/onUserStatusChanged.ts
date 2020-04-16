import * as functions from "firebase-functions";
import admin = require("firebase-admin");

admin.initializeApp();

const onUserStatusChanged = functions
  .region("europe-west1")
  .database
  .ref("/roomPresence/{userId}")
  .onUpdate(async (change) => {
    const prevEventStatus = change.before.val();
    const eventStatus = change.after.val();

    const path = eventStatus.path || (prevEventStatus && prevEventStatus.path);
    if (!path) {
      return null;
    }

    const memberRef = admin.firestore().doc(path);

    const [
      liveStatusSnapshot,
      liveMemberSnapshot,
    ] = await Promise.all([
      change.after.ref.once("value"),
      memberRef.get(),
    ]);
    const liveStatus = liveStatusSnapshot.val();
    const liveMember = liveMemberSnapshot.data();

    if (
      eventStatus.timestamp < liveStatus.timestamp ||
      !liveMember ||
      eventStatus.timestamp < liveMember.timestamp
    ) {
      return null;
    }

    if (!eventStatus.path) {
      return Promise.all([memberRef.delete(), change.after.ref.remove()]);
    }

    return null;
  });

export default onUserStatusChanged;