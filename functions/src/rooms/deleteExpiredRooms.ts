import * as functions from "firebase-functions";
import admin = require("firebase-admin");
import moment = require("moment");

const deleteExpiredRooms = functions
  .region("europe-west1")
  .https
  .onCall(async (_, context) => {
    const { auth } = context;

    if (!auth) {
      throw new functions.https.HttpsError("unauthenticated", "Requires authentication");
    }

    const userProfileSnap = await functions.app.admin
      .firestore().doc(`/users/${auth.uid}`).get();
    const userProfile = userProfileSnap.data();

    if (!userProfileSnap.exists || !userProfile || userProfile.role !== "Admin") {
      throw new functions.https.HttpsError("permission-denied", "User must be admin");
    }

    const maxLastSessionEnd = admin.firestore.Timestamp
      .fromDate(moment(admin.firestore.Timestamp.now()).add(-1, "M").toDate());
    const expiredRooms = await functions.app.admin
      .firestore()
      .collection("rooms")
      .where("lastSessionEnd", "<", maxLastSessionEnd)
      .get();

    if (!expiredRooms.size) {
      return [];
    }
    console.log(`Expired rooms found : ${expiredRooms.size}`);

    return Promise.all(expiredRooms.docs.map(roomSnap => roomSnap.ref
      .delete()
      .then(result => {
        console.log(`Deleted room ${roomSnap.id}`);
        return result;
      })))
      .then(() => expiredRooms.docs.map(roomSnap => roomSnap.id))
  });

export default deleteExpiredRooms;