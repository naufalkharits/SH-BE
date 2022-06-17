const admin = require("firebase-admin");
// const serviceAccount = require("../serviceAccountKey.json");

const setup = () => {
  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID,
    }),
    storageBucket: process.env.FIREBASE_BUCKET_URL,
  });
};

module.exports = {
  setup,
};
