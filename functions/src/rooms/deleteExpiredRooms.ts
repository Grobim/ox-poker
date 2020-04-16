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
      .fromDate(moment(admin.firestore.Timestamp.now().toDate()).add(-1, "M").toDate());
    const expiredRooms = await functions.app.admin
      .firestore()
      .collection("rooms")
      .where("lastSessionEnd", "<", maxLastSessionEnd)
      .get();

    if (!expiredRooms.size) {
      return [];
    }
    const roomWithMembersSnaps = await Promise.all(expiredRooms.docs.map(roomSnap => roomSnap.ref
      .collection("members")
      .get()
      .then((memberSnaps) => ({ roomSnap, memberSnaps }))
    ));

    return Promise.all(
      roomWithMembersSnaps
        .filter(({ memberSnaps }) => !memberSnaps.size)
        .map(({ roomSnap }) => Promise.all([
          roomSnap.ref.delete().then(() => roomSnap),
          roomSnap.ref
            .collection("registeredMembers")
            .get()
            .then((memberSnaps) => Promise.all(
              memberSnaps.docs.map(memberSnap => memberSnap.ref.delete().then(() => memberSnap))
            )),
        ]).then(([, registeredMemberSnaps]) => {
          console.log(`Deleted room (${roomSnap.id}) with members (${registeredMemberSnaps.map(snap => snap.id).join(', ')})`);
          return roomSnap.id;
        }))
    );
  });

export default deleteExpiredRooms;