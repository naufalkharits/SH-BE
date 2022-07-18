const admin = require("firebase-admin");
const { User } = require("../models");

const sendNewPushNotification = async (userId) => {
  try {
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user || !user.fcm_token) return;

    const response = await admin.messaging().send({
      notification: {
        title: "Hello World",
        body: "Hello from SecondHand NodeJS Server",
      },
      token: user.fcm_token,
    });

    console.log("Send Push Notification Done :", response);
  } catch (error) {
    console.log("Error :", error);
  }
};

module.exports = {
  sendNewPushNotification,
};
