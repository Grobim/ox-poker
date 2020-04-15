import * as functions from "firebase-functions";
import admin = require("firebase-admin");

const updateLastRoomActivity = functions
  .region("europe-west1")
  .firestore
  .document("rooms/{roomId}/members/{memberId}")
  .onDelete(async (snap, context) => {
    const membersRef = snap.ref.parent;
    const members = await membersRef.get();
    const { params: { roomId } } = context;

    if (members.size || !membersRef.parent) {
      return;
    }

    return membersRef.parent.update({
      lastSessionEnd: admin.firestore.Timestamp.now(),
      state: "LOBBY",
    }).then(() => {
      console.log(`Updated room ${roomId} last activity`);
    });
  });

export default updateLastRoomActivity;