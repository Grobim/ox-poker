import * as functions from "firebase-functions";
import admin = require("firebase-admin");

const loginToRoom = functions
  .region("europe-west1")
  .https
  .onCall(async (data: { roomId: string; passwordHash: string; }, context) => {
    const { roomId, passwordHash } = data;
    const { auth } = context;

    if (!auth) {
      throw new functions.https.HttpsError("unauthenticated", "Requires authentication");
    }

    if (!passwordHash || !roomId) {
      throw new functions.https.HttpsError("invalid-argument", "roomId and passwordHash are required");
    }

    const roomSnap = await functions.app.admin
      .firestore()
      .doc(`/rooms/${roomId}`)
      .get();
    const room = roomSnap.data();

    if (!roomSnap.exists || !room) {
      throw new functions.https.HttpsError("not-found", "Room doesn't exists");
    }

    if (passwordHash === room.passwordHash) {
      return admin.firestore()
        .doc(`/rooms/${roomId}/registeredMembers/${auth.uid}`)
        .set({ role: "MEMBER" });
    }

    throw new functions.https.HttpsError("permission-denied", "Password is incorrect");
  });

export default loginToRoom;