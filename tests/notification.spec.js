const request = require("supertest");
const { app, server } = require("../index");
const { Notification, User } = require("../models");

let testNotification;

beforeAll(async () => {
  const testUser = await User.create({
    email: "test@gmail.com",
    password: "123456",
  });
  testNotification = await Notification.create({
    type: "TEST_NOTIFICATION",
    user_id: testUser.id,
    read: false,
  });
});

afterAll(async () => {
  server.close();
});

describe("Get Notifications", () => {});

describe("Update Notification", () => {});

describe("Delete Notification", () => {});
