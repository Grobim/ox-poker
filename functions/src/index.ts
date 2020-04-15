import * as functions from "firebase-functions";
import admin = require("firebase-admin");
import moment = require("moment");

admin.initializeApp();

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

const deleteExpiredRooms = functions
  .region("europe-west1")
  .https
  .onRequest(async (_, res) => {
    const maxLastSessionEnd = admin.firestore.Timestamp
      .fromDate(moment().add(-1, "M").toDate());
    const expiredRooms = await functions.app.admin
      .firestore()
      .collection("rooms")
      .where("lastSessionEnd", "<", maxLastSessionEnd)
      .get();

    if (!expiredRooms.size) {
      return res.json({ deletedRooms: [] });
    }
    console.log(`Expired rooms found : ${expiredRooms.size}`);

    return Promise
      .all(expiredRooms.docs.map(roomSnap => roomSnap.ref.delete().then(result => {
        console.log(`Deleted room ${roomSnap.id}`);
        return result;
      })))
      .then(() => res.json({ deletedRooms: expiredRooms.docs.map(roomSnap => roomSnap.id) }))
  });

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

    const liveStatusSnapshot = await change.after.ref.once("value");
    const liveStatus = liveStatusSnapshot.val();

    if (eventStatus.timestamp < liveStatus.timestamp) {
      return null;
    }

    if (!eventStatus.path) {
      return Promise.all([memberRef.delete(), change.after.ref.remove()]);
    }

    return null;
  });

exports.updateLastRoomActivity = updateLastRoomActivity;
exports.deleteExpiredRooms = deleteExpiredRooms;
exports.onUserStatusChanged = onUserStatusChanged;
