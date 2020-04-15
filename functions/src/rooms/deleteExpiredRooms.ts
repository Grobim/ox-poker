import * as functions from "firebase-functions";
import admin = require("firebase-admin");
import moment = require("moment");

const deleteExpiredRooms = functions
  .region("europe-west1")
  .https
  .onRequest(async (_, res) => {
    const maxLastSessionEnd = admin.firestore.Timestamp
      .fromDate(moment(admin.firestore.Timestamp.now()).add(-1, "M").toDate());
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

export default deleteExpiredRooms;